import type { LoadAppInput } from '@/use-cases/load/dto/LoadAppInput.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';

/**
 * Use case contract for handling the BigCommerce **load** callback.
 *
 * Implementations should:
 * - Verify the `signed_payload_jwt` (authenticity + validity window).
 * - Decode and return the full {@link SignedPayloadClaims} so decorators can
 *   derive `storeHash`, `user.id`, `owner`, `channel_id`, etc.
 *
 * Notes:
 * - No persistence or side‑effects here. Decorate an implementation to perform
 *   domain actions (e.g., telemetry, audit, policy checks, session hydration).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks
 */
export interface LoadAppUseCase {
  /**
   * Verify and decode the load callback’s `signed_payload_jwt`.
   *
   * @param input - Transport-agnostic DTO containing the raw JWT.
   * @returns A promise that resolves to verified {@link SignedPayloadClaims}.
   *
   * @throws {MalformedJwtError} If the token is not `header.payload.signature`.
   * @throws {InvalidJwtSignatureError} If the HMAC signature check fails.
   * @throws {JwtLifetimeError} If the token is expired or not yet valid (`nbf…exp`).
   */
  execute(input: LoadAppInput): Promise<SignedPayloadClaims>;
}
