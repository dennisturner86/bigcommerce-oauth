import type { SignedPayloadVerifier } from '@/use-cases/shared/contracts/SignedPayloadVerifier.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { UninstallAppUseCase } from './contracts/UninstallAppUseCase.js';
import type { UninstallAppInput } from './dto/UninstallAppInput.js';

/**
 * **UninstallApp** — base implementation of {@link UninstallAppUseCase}.
 *
 * Minimal responsibility:
 *  - Verify the BigCommerce `signed_payload_jwt`.
 *  - Decode and return the full {@link SignedPayloadClaims}.
 *
 * No persistence, notifications, or other side-effects are performed here.
 * Compose those via decorators (e.g., `DeactivateStore`, `NotifyUninstall`).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks
 */
export class UninstallApp implements UninstallAppUseCase {
  /**
   * @param verifier Implementation that authenticates and decodes BigCommerce
   *                 signed-payload JWTs (HMAC-SHA256 over `header.payload`).
   */
  constructor(private readonly verifier: SignedPayloadVerifier) {}

  /**
   * Verify and decode the uninstall callback’s JWT.
   *
   * @param input Transport-agnostic DTO containing `signed_payload_jwt`.
   * @returns A promise resolving to the verified {@link SignedPayloadClaims}.
   *
   * @throws {MalformedJwtError} If the token is not `header.payload.signature`.
   * @throws {InvalidJwtSignatureError} If HMAC verification fails.
   * @throws {JwtLifetimeError} If current time is outside `nbf…exp`.
   */
  public async execute(input: UninstallAppInput): Promise<SignedPayloadClaims> {
    return Promise.resolve(this.verifier.verify(input.signedPayloadJwt));
  }
}
