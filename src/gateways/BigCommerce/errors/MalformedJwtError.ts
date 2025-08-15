/**
 * Thrown when a `signed_payload_jwt` does not contain exactly
 * three dot-delimited parts (`header.payload.signature`).
 *
 * Caught by the controller and mapped to **400 Bad Request**.
 */
export class MalformedJwtError extends Error {
  constructor() {
    super('Malformed signed_payload_jwt');
  }
}
