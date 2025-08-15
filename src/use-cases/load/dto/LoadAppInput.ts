/**
 * Transport-agnostic input for {@link LoadAppUseCase}.
 *
 * BigCommerce includes a `signed_payload_jwt` when the app is opened
 * in the Control Panel (Load callback). This DTO carries that token.
 */
export interface LoadAppInput {
  /**
   * The BigCommerce-signed JWT sent to the **Load** callback.
   * This token is verified and parsed by {@link SignedPayloadVerifier}.
   */
  signedPayloadJwt: string;
}
