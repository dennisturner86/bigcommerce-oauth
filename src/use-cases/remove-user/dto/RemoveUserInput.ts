/**
 * Transport-agnostic input for {@link RemoveUser}.
 */
export interface RemoveUserInput {
  /**
   * The BigCommerce-signed JWT sent to /remove_user callbacks.
   * This token is verified and parsed by {@link SignedPayloadVerifier}.
   */
  signedPayloadJwt: string;
}
