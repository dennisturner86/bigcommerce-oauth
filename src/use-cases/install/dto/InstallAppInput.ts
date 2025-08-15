/**
 * Data-transfer object passed to {@link InstallApp.execute}.
 *
 * @property code        OAuth 2.0 authorization code returned by BigCommerce.
 * @property context     Store context string (e.g., `stores/{store_hash}`).
 * @property scope       Granted permission scope string.
 * @property redirectUri Redirect URI that was supplied in the authorization
 *                       request and must be echoed back for token exchange.
 */
export interface InstallAppInput {
  code: string;
  context: string;
  scope: string;
  redirectUri: string;
}
