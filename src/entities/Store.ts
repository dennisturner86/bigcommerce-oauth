import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';
import { StoreHash } from '@/value-objects/StoreHash';

/**
 * Domain entity representing a **BigCommerce store installation**.
 *
 * @remarks
 * This is the canonical representation of a store within your domain model,
 * derived from the BigCommerce OAuth installation flow.
 *
 * Typical usage:
 * - Created during installation via {@link fromAuthSession}.
 * - Passed to {@link StoreRepository.upsertStore} to persist/update state.
 * - Used to identify and authorize API requests for a given store.
 */
export class Store {
  /**
   * @param hash - Unique store identifier in BigCommerce (parsed from `"stores/{hash}"` context).
   * @param accessToken - OAuth access token issued for this installation.
   * @param scope - Granted OAuth scopes for this installation.
   * @param installerUserId - BigCommerce user ID of the installer.
   * @param installerEmail - Email address of the installer.
   * @param ownerId - BigCommerce user ID of the store owner.
   * @param ownerEmail - Email address of the store owner.
   */
  constructor(
    public readonly hash: StoreHash,
    public readonly accessToken: string,
    public readonly scope: string,
    public readonly installerUserId: number,
    public readonly installerEmail: string,
    public readonly ownerId: number,
    public readonly ownerEmail: string,
  ) {}

  /**
   * Factory method to build a {@link Store} entity from a raw OAuth {@link AuthSession}.
   *
   * @param session - The OAuth session object returned by the BigCommerce token exchange.
   *                  Must contain the store context, access token, scopes, and user/owner details.
   * @returns A fully populated {@link Store} entity.
   *
   * @example
   * ```ts
   * const session = await oauthClient.exchange(code, context, scope, redirectUri);
   * const store = Store.fromAuthSession(session);
   * await storeRepository.upsertStore(store);
   * ```
   */
  static fromAuthSession(session: AuthSession): Store {
    // session.context is "stores/{hash}" → reuse JWT sub parser
    const hash = StoreHash.fromJWTSub(session.context);

    return new Store(
      hash,
      session.access_token,
      session.scope,
      session.user.id,
      session.user.email,
      session.owner.id,
      session.owner.email,
    );
  }
}
