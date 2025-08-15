import type { OAuthClient } from '@/use-cases/install/contracts/OAuthClient';
import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';
import { BigCommerceTokenExchangeError } from './errors/BigCommerceTokenExchangeError';

/**
 * Gateway: **BigCommerceOAuthClient**
 *
 * Concrete implementation of {@link OAuthClient} that performs the
 * OAuth 2.0 “authorization code” exchange against BigCommerce’s
 * `/oauth2/token` endpoint.
 *
 * By isolating all HTTP details here, we keep the application layer
 * fully decoupled from transport concerns.
 */
export class BigCommerceOAuthClient implements OAuthClient {
  /**
   * Constructs a new {@link BigCommerceOAuthClient}.
   *
   * @param clientId     The BigCommerce public **client ID** issued for the app.
   * @param clientSecret The corresponding **client secret** used to sign requests.
   */
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  /**
   * Exchanges an authorization **code** for an {@link AuthSession}.
   *
   * @param code        OAuth authorization code received from BigCommerce.
   * @param context     Store context (e.g., `stores/{store_hash}`).
   * @param scope       Scope string returned alongside the code.
   * @param redirectUri The same redirect URI used during the authorize step.
   *
   * @returns A promise that resolves to a populated {@link AuthSession}.
   *
   * @throws Error If BigCommerce responds with a non-2xx status or the network
   *               request fails for any reason.
   */
  async exchange(
    code: string,
    context: string,
    scope: string,
    redirectUri: string,
  ): Promise<AuthSession> {
    const res = await fetch('https://login.bigcommerce.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        context,
        scope,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      throw new BigCommerceTokenExchangeError(res.status, res.statusText);
    }

    return (await res.json()) as AuthSession;
  }
}
