import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';
import type { InstallAppUseCase } from './contracts/InstallAppUseCase';
import type { OAuthClient } from './contracts/OAuthClient';
import type { InstallAppInput } from './dto/InstallAppInput';

/**
 * **InstallApp** — base implementation of {@link InstallAppUseCase}.
 *
 * Minimal responsibility:
 *  - Exchange the BigCommerce OAuth **authorization code** for an {@link AuthSession}.
 *
 * Notes:
 *  - Performs **no persistence or side-effects**. Compose those via decorators
 *    (e.g., map to `Store` and upsert, telemetry, notifications, idempotency).
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/auth#receiving-the-access_token-response
 */
export class InstallApp implements InstallAppUseCase {
  /**
   * @param oauthClient Implementation that performs the remote token exchange
   *                    against BigCommerce (`POST /oauth2/token`).
   */
  constructor(private readonly oauthClient: OAuthClient) {}

  /**
   * Exchange the OAuth code for an authenticated session.
   *
   * @param input Transport-agnostic DTO containing `code`, `context`, `scope`,
   *              and the `redirectUri` used during authorization.
   * @returns A promise that resolves to the provider’s {@link AuthSession}.
   *
   * @throws {BigCommerceTokenExchangeError} If BigCommerce responds non-2xx.
   * @throws {Error} For network failures or unexpected conditions.
   */
  public async execute(input: InstallAppInput): Promise<AuthSession> {
    return this.oauthClient.exchange(input.code, input.context, input.scope, input.redirectUri);
  }
}
