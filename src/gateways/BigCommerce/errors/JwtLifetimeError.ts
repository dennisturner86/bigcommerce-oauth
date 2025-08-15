/**
 * Thrown when the current timestamp is outside the token’s
 * validity window (`nbf … exp`).
 *
 * Caught by the controller and mapped to **401 Unauthorized**.
 */
export class JwtLifetimeError extends Error {
  constructor() {
    super('JWT expired or not yet valid');
  }
}
