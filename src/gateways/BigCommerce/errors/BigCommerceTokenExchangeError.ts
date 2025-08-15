/**
 * Thrown when the BigCommerce OAuth **token-exchange** endpoint
 * (`POST /oauth2/token`) responds with a non-2xx HTTP status.
 *
 * Controllers can inspect the `status` field to map specific ranges
 * (e.g. **4xx → 502** to the client, **5xx → 503**) or simply treat any
 * instance of this error as “upstream authentication failure.”
 */
export class BigCommerceTokenExchangeError extends Error {
  /**
   * @param status      HTTP status code returned by BigCommerce.
   * @param statusText  HTTP status text (e.g. `"Bad Request"`).
   */
  constructor(
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`BigCommerce token exchange failed: ${status.toString()} ${statusText}`);
  }
}
