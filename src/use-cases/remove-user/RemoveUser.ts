import type { SignedPayloadVerifier } from '@/use-cases/shared/contracts/SignedPayloadVerifier';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims';
import type { RemoveUserUseCase } from './contracts/RemoveUserUseCase';
import type { RemoveUserInput } from './dto/RemoveUserInput';

/**
 * **RemoveUser** — base implementation of {@link RemoveUserUseCase}.
 *
 * Minimal responsibility:
 *  - Verify the BigCommerce `signed_payload_jwt`.
 *  - Decode and return the full {@link SignedPayloadClaims}.
 *
 * No persistence or other side-effects are performed here.
 * Compose those via decorators (e.g., `RemoveUserFromStore`, telemetry, notifications).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks
 */
export class RemoveUser implements RemoveUserUseCase {
  /**
   * @param verifier Implementation that authenticates and decodes BigCommerce
   *                 signed-payload JWTs (HMAC-SHA256 over `header.payload`).
   */
  constructor(private readonly verifier: SignedPayloadVerifier) {}

  /**
   * Verify and decode the remove-user callback’s JWT.
   *
   * @param input Transport-agnostic DTO containing `signed_payload_jwt`.
   * @returns A promise resolving to the verified {@link SignedPayloadClaims}.
   *
   * @throws {MalformedJwtError} If the token is not `header.payload.signature`.
   * @throws {InvalidJwtSignatureError} If HMAC verification fails.
   * @throws {JwtLifetimeError} If current time is outside `nbf…exp`.
   */
  public async execute(input: RemoveUserInput): Promise<SignedPayloadClaims> {
    return this.verifier.verify(input.signedPayloadJwt);
  }
}
