import { InvalidStoreContextError } from './errors/InvalidStoreContextError';

/**
 * Represent a validated BigCommerce store hash as a value object.
 * Construct via {@link StoreHash.fromSub} or {@link StoreHash.from}.
 */
export class StoreHash {
  private static readonly SUB_PATTERN = /^stores\/(?<hash>[A-Za-z0-9_-]{3,64})$/;

  private constructor(private readonly value: string) {}

  /** Create from raw hash (already isolated, e.g., "abc123"). */
  static from(hash: string): StoreHash {
    if (!hash || hash.length < 3 || hash.length > 64) {
      throw new InvalidStoreContextError(`hash: ${hash}`);
    }
    return new StoreHash(hash);
  }

  /** Create from JWT `sub` like "stores/abc123". */
  static fromJWTSub(sub: string): StoreHash {
    const m = this.SUB_PATTERN.exec(sub);
    if (!m?.groups?.hash) throw new InvalidStoreContextError(`sub: ${sub}`);
    return new StoreHash(m.groups.hash);
  }

  /** Get the raw hash string. */
  toString(): string {
    return this.value;
  }

  /** Value-based equality. */
  equals(other: StoreHash): boolean {
    return this.value === other.value;
  }
}
