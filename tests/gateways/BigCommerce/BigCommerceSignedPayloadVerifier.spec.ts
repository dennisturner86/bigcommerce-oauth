import { describe, it, expect, vi, afterEach } from 'vitest';

import { BigCommerceSignedPayloadVerifier } from '@/gateways/BigCommerce/BigCommerceSignedPayloadVerifier.js';
import { InvalidJwtSignatureError } from '@/gateways/BigCommerce/errors/InvalidJwtSignatureError.js';
import { JwtLifetimeError } from '@/gateways/BigCommerce/errors/JwtLifetimeError.js';
import { MalformedJwtError } from '@/gateways/BigCommerce/errors/MalformedJwtError.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';

import { createHmac, randomUUID } from 'crypto';

const header = { alg: 'HS256', typ: 'JWT' } as const;

function b64url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function encodeHeader(): string {
  return Buffer.from(JSON.stringify(header), 'utf8').toString('base64url');
}

function encodePayload(claims: SignedPayloadClaims): string {
  return Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url');
}

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

/**
 * Build a signed JWT (header.payload.signature) using HS256 with the given secret.
 */
function buildSignedJwt(claims: SignedPayloadClaims, secret: string): string {
  const headerB64 = encodeHeader();
  const payloadB64 = encodePayload(claims);
  const signatureB64 = sign(`${headerB64}.${payloadB64}`, secret);
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

describe('BigCommerceSignedPayloadVerifier', () => {
  const secret = 'super-secret';
  const verifier = new BigCommerceSignedPayloadVerifier(secret);

  // Freeze time at a known instant: 2025-01-01T00:00:00Z
  const nowSeconds = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000);

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns claims for a valid token within lifetime', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(nowSeconds * 1000));

    const claims: SignedPayloadClaims = {
      iss: 'bc',
      iat: nowSeconds - 10,
      nbf: nowSeconds - 5,
      exp: nowSeconds + 300,
      aud: 'my-app',
      sub: 'stores/abc123',
      user: { id: 101, email: 'installer@store.com', locale: 'en-US' },
      owner: { id: 202, email: 'owner@store.com' },
      jti: randomUUID(),
    };

    const token = buildSignedJwt(claims, secret);
    const result = verifier.verify(token);

    expect(result).toEqual(claims);
  });

  it('throws MalformedJwtError when token does not have exactly 3 parts', () => {
    const badToken = 'only.two.parts';
    expect(() => verifier.verify(badToken)).toThrow(MalformedJwtError);
  });

  it('throws InvalidJwtSignatureError when signature does not match', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(nowSeconds * 1000));

    const claims: SignedPayloadClaims = {
      iss: 'bigcommerce',
      iat: nowSeconds,
      nbf: nowSeconds,
      exp: nowSeconds + 60,
      aud: 'my-app',
      sub: 'stores/abc123',
    };

    // Sign with a different secret to force mismatch
    const token = buildSignedJwt(claims, 'wrong-secret');

    expect(() => verifier.verify(token)).toThrow(InvalidJwtSignatureError);
  });

  it('throws JwtLifetimeError when token is expired (now >= exp)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(nowSeconds * 1000));

    const claims: SignedPayloadClaims = {
      iss: 'bigcommerce',
      iat: nowSeconds - 120,
      nbf: nowSeconds - 60,
      exp: nowSeconds, // expires exactly at "now" → invalid (now >= exp)
      aud: 'my-app',
      sub: 'stores/abc123',
    };

    const token = buildSignedJwt(claims, secret);

    expect(() => verifier.verify(token)).toThrow(JwtLifetimeError);
  });

  it('throws JwtLifetimeError when token is not yet valid (now < nbf)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(nowSeconds * 1000));

    const claims: SignedPayloadClaims = {
      iss: 'bigcommerce',
      iat: nowSeconds - 5,
      nbf: nowSeconds + 10, // not valid yet
      exp: nowSeconds + 1000,
      aud: 'my-app',
      sub: 'stores/abc123',
    };

    const token = buildSignedJwt(claims, secret);

    expect(() => verifier.verify(token)).toThrow(JwtLifetimeError);
  });

  it('propagates SyntaxError when payload is not valid JSON', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(nowSeconds * 1000));

    const headerB64 = encodeHeader();

    // Create an invalid JSON payload
    const payloadInvalidJson = Buffer.from('{not json', 'utf8').toString('base64url');

    const signatureB64 = sign(`${headerB64}.${payloadInvalidJson}`, secret);
    const token = `${headerB64}.${payloadInvalidJson}.${signatureB64}`;

    expect(() => verifier.verify(token)).toThrow(SyntaxError);
  });
});
