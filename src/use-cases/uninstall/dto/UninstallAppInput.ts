/**
 * Data Transfer Object consumed by {@link UninstallApp.execute}.
 *
 * @property signedPayloadJwt Raw JWT taken from the `signed_payload_jwt`
 *                            query-string parameter that BigCommerce includes
 *                            in every **GET /uninstall** callback.
 */
export interface UninstallAppInput {
  signedPayloadJwt: string;
}
