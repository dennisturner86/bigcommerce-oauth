import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';

/**
 * Abstraction over any OAuth client capable of exchanging an
 * authorization code for an access token and associated session details.
 *
 * Implementations live in the `gateways/` layer (e.g. `BigCommerceOAuthClient`)
 * and handle all transport-level concerns (HTTP requests, headers, retries, etc.),
 * while the application layer depends only on this contract.
 */
export interface OAuthClient {
  /**
   * Exchanges an OAuth authorization code for an authenticated session.
   *
   * @param code        OAuth 2.0 authorization **code** received from the provider.
   * @param context     Provider-specific context (e.g., `stores/{store_hash}` for BigCommerce).
   * @param scope       Granted permission scope string returned with the code.
   * @param redirectUri The **redirect URI** that was registered with the provider and
   *                    used during the authorization request.
   *
   * @returns A promise that resolves to a fully-populated {@link AuthSession}
   *          containing the access token, scope, user info, and store context.
   *
   * @throws Error If the underlying provider returns a non-success response
   *               or the network request fails.
   */
  exchange(code: string, context: string, scope: string, redirectUri: string): Promise<AuthSession>;
}
