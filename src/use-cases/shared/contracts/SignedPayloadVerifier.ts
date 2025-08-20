import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';

/**
 * Abstraction over JWT verification.
 */
export interface SignedPayloadVerifier {
  /**
   * Verifies the token and returns the parsed claims.
   *
   * @param token Raw `signed_payload_jwt` from BigCommerce.
   * @returns Parsed {@link SignedPayloadClaims}.
   * @throws Error If the signature is invalid or the token expired.
   */
  verify(token: string): SignedPayloadClaims;
}
