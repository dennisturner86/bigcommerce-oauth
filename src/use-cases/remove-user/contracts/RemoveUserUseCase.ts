import type { RemoveUserInput } from '@/use-cases/remove-user/dto/RemoveUserInput.js';
import type { UseCase } from '@/use-cases/shared/contracts/UseCase.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { RemoveUserContext } from '../RemoveUserContext.js';

/**
 * Use case contract for handling the BigCommerce **remove user** callback.
 *
 * Implementations should:
 * - Verify the `signed_payload_jwt` (authenticity + validity window).
 * - Decode and return the full {@link SignedPayloadClaims} so decorators can
 *   derive `storeHash`, `user.id`, `owner`, etc.
 *
 * Notes:
 * - No persistence or side‑effects here. Decorate an implementation to perform
 *   domain actions (e.g., inactivate the user in your store, emit telemetry,
 *   audit, notifications).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks
 */
export interface RemoveUserUseCase<TContext extends RemoveUserContext = RemoveUserContext>
  extends UseCase<RemoveUserInput, SignedPayloadClaims, TContext> {
  /**
   * Verify and decode the remove-user callback’s `signed_payload_jwt`.
   *
   * @param input - Transport-agnostic DTO containing the raw JWT.
   * @returns A promise that resolves to verified {@link SignedPayloadClaims}.
   *
   * @throws {MalformedJwtError} If the token is not `header.payload.signature`.
   * @throws {InvalidJwtSignatureError} If the HMAC signature check fails.
   * @throws {JwtLifetimeError} If the token is expired or not yet valid (`nbf…exp`).
   */
  execute(input: RemoveUserInput, context: TContext): Promise<SignedPayloadClaims>;
}
