import type { UseCase } from '@/use-cases/shared/contracts/UseCase.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { UninstallAppInput } from '@/use-cases/uninstall/dto/UninstallAppInput.js';
import type { UninstallAppContext } from '../UninstallAppContext.js';

/**
 * Use case contract for handling the BigCommerce **app uninstall** callback.
 *
 * Responsibilities of implementations:
 * - Verify the `signed_payload_jwt` (authenticity + lifetime).
 * - Decode and return the full {@link SignedPayloadClaims} for downstream use.
 *
 * Notes:
 * - This interface performs **no persistence or side-effects** by itself.
 *   Decorators (e.g., `DeactivateStore`) should wrap an implementation to apply
 *   domain actions (mark store inactive, notify, telemetry, etc.).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks
 */
export interface UninstallAppUseCase<TContext extends UninstallAppContext = UninstallAppContext>
  extends UseCase<UninstallAppInput, SignedPayloadClaims, TContext> {
  /**
   * Verify and decode the uninstall callback’s `signed_payload_jwt`.
   *
   * @param input - Transport-agnostic DTO containing the raw JWT sent by BigCommerce.
   * @returns A promise that resolves to the verified and decoded {@link SignedPayloadClaims}.
   *
   * @throws {MalformedJwtError} If the token is not a three-part JWT.
   * @throws {InvalidJwtSignatureError} If the HMAC-SHA256 signature does not match.
   * @throws {JwtLifetimeError} If the token is expired or not yet valid (`nbf…exp` window).
   */
  execute(input: UninstallAppInput, context: TContext): Promise<SignedPayloadClaims>;
}
