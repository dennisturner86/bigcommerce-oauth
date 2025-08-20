import type { SignedPayloadVerifier } from '@/use-cases/shared/contracts/SignedPayloadVerifier.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import { createHmac } from 'crypto';
import { InvalidJwtSignatureError } from './errors/InvalidJwtSignatureError.js';
import { JwtLifetimeError } from './errors/JwtLifetimeError.js';
import { MalformedJwtError } from './errors/MalformedJwtError.js';

/**
 * Verifies **BigCommerce** `signed_payload_jwt` tokens using the app’s *client-secret*.
 *
 * High-level algorithm (matches BigCommerce spec):
 * 1. **Split** the token into `header . payload . signature` parts.
 * 2. **Re-compute** `HMAC-SHA256(clientSecret, header.payload)` and Base64-URL-encode it.
 * 3. **Compare** the computed signature with the token’s signature field.
 * 4. **Decode & parse** the payload into a typed {@link SignedPayloadClaims} object.
 * 5. **Reject** tokens outside their `nbf … exp` validity window.
 *
 * A valid token yields the decoded claims; otherwise an error is thrown.
 */
export class BigCommerceSignedPayloadVerifier implements SignedPayloadVerifier {
  /**
   * @param clientSecret BigCommerce **client-secret** assigned to the app
   *                     (used as the HMAC key when verifying signatures).
   */
  constructor(private readonly clientSecret: string) {}

  /**
   * Validate a `signed_payload_jwt` and return its decoded claims.
   *
   * @param token Raw JWT from BigCommerce (query param `signed_payload_jwt`).
   * @returns Parsed {@link SignedPayloadClaims} if the token is authentic
   *          *and* within its valid time window.
   *
   * @throws {Error} If the token is malformed, the signature check fails,
   *                 or the token is expired / not yet valid.
   */
  public verify(token: string): SignedPayloadClaims {
    const { headerB64, payloadB64, signatureB64 } = this.splitToken(token);
    this.verifySignature(headerB64, payloadB64, signatureB64);
    const claims = this.parseClaims(payloadB64);
    this.validateLifetime(claims);
    return claims;
  }

  /**
   * Split a JWT into its three Base64-URL components.
   *
   * @param token Full JWT string (`<header>.<payload>.<signature>`).
   * @returns An object containing each component individually.
   *
   * @throws {Error} If the token does not contain *exactly* three parts.
   */
  private splitToken(token: string): {
    headerB64: string;
    payloadB64: string;
    signatureB64: string;
  } {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new MalformedJwtError();
    }
    return { headerB64, payloadB64, signatureB64 };
  }

  /**
   * Compute the expected HMAC-SHA256 signature and compare it to the supplied one.
   *
   * @param headerB64    Base64-URL encoded JWT header.
   * @param payloadB64   Base64-URL encoded JWT payload.
   * @param signatureB64 Base64-URL encoded JWT signature supplied by BigCommerce.
   *
   * @throws {Error} If the computed signature does not match the supplied one.
   */
  private verifySignature(headerB64: string, payloadB64: string, signatureB64: string): void {
    const data = `${headerB64}.${payloadB64}`;
    const expectedSig = createHmac('sha256', this.clientSecret).update(data).digest('base64url');

    if (expectedSig !== signatureB64) {
      throw new InvalidJwtSignatureError();
    }
  }

  /**
   * Decode the payload component and parse it into {@link SignedPayloadClaims}.
   *
   * @param payloadB64 Base64-URL encoded JWT payload.
   * @returns The decoded claims object.
   *
   * @throws {SyntaxError} If the payload JSON cannot be parsed.
   */
  private parseClaims(payloadB64: string): SignedPayloadClaims {
    const json = Buffer.from(payloadB64, 'base64url').toString('utf8');
    return JSON.parse(json) as SignedPayloadClaims;
  }

  /**
   * Ensure the token is being used within its validity window.
   *
   * @param claims Parsed claims produced by {@link parseClaims}.
   *
   * @throws {Error} If the current time is before `nbf` *or* on/after `exp`.
   */
  private validateLifetime(claims: SignedPayloadClaims): void {
    const now = Math.floor(Date.now() / 1000);
    if (now < claims.nbf || now >= claims.exp) {
      throw new JwtLifetimeError();
    }
  }
}
