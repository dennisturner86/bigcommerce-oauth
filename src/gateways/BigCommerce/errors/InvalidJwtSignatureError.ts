/**
 * Thrown when the HMAC-SHA256 signature computed with the app’s
 * client-secret does **not** match the signature part of the token.
 *
 * Caught by the controller and mapped to **401 Unauthorized**.
 */
export class InvalidJwtSignatureError extends Error {
  constructor() {
    super('Invalid JWT signature');
  }
}
