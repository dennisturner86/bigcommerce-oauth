/**
 * Throw for malformed BigCommerce `sub` contexts (expected "stores/{hash}").
 */
export class InvalidStoreContextError extends Error {
  constructor(public readonly context: string) {
    super(`Invalid BigCommerce sub context: "${context}". Expected "stores/{hash}".`);
    this.name = 'InvalidStoreContextError';
  }
}
