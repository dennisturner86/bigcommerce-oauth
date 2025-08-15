import type { InstallAppInput } from '@/use-cases/install/dto/InstallAppInput';
import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';

/**
 * Use case contract for handling the BigCommerce **install (OAuth callback)** flow.
 *
 * Implementations should:
 * - Exchange the OAuth **authorization code** for an {@link AuthSession}.
 * - Return the raw session as provided by BigCommerce (no side-effects here).
 *
 * Notes:
 * - Keep this use case **framework- and storage-agnostic**. Persistence,
 *   mapping to domain entities (e.g., `Store`), telemetry, notifications, and
 *   idempotency should be composed via decorators.
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/auth#access-token-response
 */
export interface InstallAppUseCase {
  /**
   * Exchange the OAuth code for an {@link AuthSession}.
   *
   * @param input - Transport-agnostic DTO containing `code`, `context`, `scope`,
   *                and the `redirectUri` that must match the app’s configured URI.
   * @returns A promise resolving to the authenticated {@link AuthSession}.
   *
   * @throws {Error} If the provider returns a non-2xx response or the network fails.
   */
  execute(input: InstallAppInput): Promise<AuthSession>;
}
