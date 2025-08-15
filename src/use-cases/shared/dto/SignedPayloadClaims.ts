/**
 * Decoded claims from a BigCommerce `signed_payload_jwt`.
 *
 * Source spec → <https://developer.bigcommerce.com/docs/integrations/apps/guide/callbacks#data-properties-in-the-signed_payload_jwt>
 *
 * @property aud        Audience – the app’s **client-ID** this JWT was issued for.
 * @property iss        Issuer – always the literal string `"bc"`.
 * @property iat        *Issued-at* timestamp (Unix seconds).
 * @property nbf        *Not-before* timestamp; equal to {@link iat}.
 * @property exp        Expiration timestamp (Unix seconds).
 * @property jti        Unique JWT identifier (UUID v4).
 * @property sub        Store context, e.g. `"stores/abc123"`.
 * @property url        Deep-link URL back to the Control Panel (may be empty).
 * @property channel_id Storefront channel that triggered the callback, or `null`.
 * @property user       Authenticated user who performed the action.
 * @property owner      Store owner (may be the same as {@link user}).
 */
export interface SignedPayloadClaims {
  readonly aud: string;
  readonly iss: 'bc';
  readonly iat: number;
  readonly nbf: number;
  readonly exp: number;
  readonly jti: string;
  readonly sub: string;
  readonly url?: string;
  readonly channel_id?: number | null;

  readonly user: {
    /** BigCommerce user ID. */
    readonly id: number;
    /** User’s email address. */
    readonly email: string;
    /** IETF language tag, e.g. `"en-US"`. */
    readonly locale: string;
  };

  readonly owner: {
    /** Store owner’s BigCommerce user ID. */
    readonly id: number;
    /** Store owner’s email address. */
    readonly email: string;
  };
}
