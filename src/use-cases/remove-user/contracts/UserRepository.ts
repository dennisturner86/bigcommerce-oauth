import type { StoreHash } from '@/value-objects/StoreHash';

/**
 * Define persistence operations for store users.
 *
 * This interface lives in the use-cases layer to invert dependencies:
 * concrete implementations reside under gateways/.
 */
export interface UserRepository {
  /**
   * Remove or inactivate a user for a specific BigCommerce store.
   *
   * @param userId - The numeric BigCommerce user identifier to remove.
   * @param storeHash - The BigCommerce store hash (e.g., "abc123") that scopes the user.
   * @returns Promise that resolves when the operation completes.
   */
  removeUser(userId: number, storeHash: StoreHash): Promise<void>;
}
