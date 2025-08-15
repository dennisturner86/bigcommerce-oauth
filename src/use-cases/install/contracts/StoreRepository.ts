import type { Store } from '@/entities/Store';
import type { StoreHash } from '@/value-objects/StoreHash';

/**
 * Persistence contract for **store lifecycle** state.
 *
 * Implementations live in the gateways layer (e.g., Supabase adapter) and
 * must be safe to call multiple times (callbacks can retry).
 *
 * @remarks
 * - Prefer **idempotent** operations (UPSERT on `store_hash`, UPDATE to the same value).
 * - Keep tokens/scope current when upserting after re-installs.
 */
export interface StoreRepository {
  /**
   * Mark a store record as **inactive** after an uninstall callback.
   *
   * @param storeHash - Unique BigCommerce store hash (e.g., `"abcd123"`).
   * @returns Promise that resolves when the update completes.
   *
   * @remarks
   * Should be idempotent: calling this multiple times must leave the same final state.
   */
  deactivateStore(storeHash: StoreHash): Promise<void>;

  /**
   * Create or update a store record derived from the OAuth install {@link Store}.
   *
   * @param store - Domain entity built from the {@link AuthSession} (e.g., via `Store.fromAuthSession`).
   * @returns Promise that resolves when the upsert completes.
   *
   * @remarks
   * - Must be **idempotent** (e.g., `INSERT ... ON CONFLICT (store_hash) DO UPDATE SET ...`).
   * - Should refresh mutable fields on re-install: access token, scope, owner/installer info, etc.
   */
  upsertStore(store: Store): Promise<void>;
}
