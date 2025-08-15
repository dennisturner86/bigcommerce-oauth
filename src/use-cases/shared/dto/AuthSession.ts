/**
 * OAuth **access-token response** returned by BigCommerce.
 *
 * Mirrors the JSON payload documented in the BigCommerce OAuth guide.
 *
 * @see https://developer.bigcommerce.com/docs/integrations/apps/guide/auth#access-token-response
 *
 * @property access_token        Bearer token used for authenticated API calls.
 * @property scope               Space-delimited list of permission scopes granted.
 * @property user                BigCommerce user who initiated the install.
 * @property user.id             Numeric user ID.
 * @property user.username       User’s login/email string.
 * @property user.email          Email address of the user.
 * @property owner               Store owner information (may differ from `user`).
 * @property owner.id            Numeric owner ID.
 * @property owner.username      Owner’s username string.
 * @property owner.email         Email address of the owner.
 * @property context             Store identifier in the form `stores/{store_hash}`.
 * @property ajs_anonymous_id    Segment anonymous identifier (nullable).
 * @property account_uuid        BigCommerce account UUID for analytics.
 */
export interface AuthSession {
  readonly access_token: string;
  readonly scope: string;
  readonly user: {
    readonly id: number;
    readonly username: string;
    readonly email: string;
  };
  readonly owner: {
    readonly id: number;
    readonly username: string;
    readonly email: string;
  };
  readonly context: string;
  readonly ajs_anonymous_id: string | null;
  readonly account_uuid: string;
}
