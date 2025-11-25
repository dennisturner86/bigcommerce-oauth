import type { InstallAppUseCase } from '@/use-cases/install/contracts/InstallAppUseCase.js';
import type { InstallAppInput } from '@/use-cases/install/dto/InstallAppInput.js';
import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { AuthSession } from '@/use-cases/shared/dto/AuthSession.js';

/**
 * Base class for **Install**-flow decorators.
 *
 * Extend this to add cross-cutting behavior around an {@link InstallAppUseCase}
 * implementation while preserving the same contract. Typical examples:
 * - Mapping the raw {@link AuthSession} to a domain `Store` and upserting it
 * - Emitting telemetry/metrics
 * - Sending notifications/audit logs
 * - Idempotency / locking
 *
 * This class delegates to the wrapped implementation by default; override
 * `execute` to add pre-/post-logic.
 *
 * @example
 * ```ts
 * export class UpsertStoreFromSession extends InstallAppDecorator {
 *   constructor(
 *     inner: InstallAppUseCase,
 *     private readonly stores: StoreRepository
 *   ) { super(inner); }
 *
 *   async execute(input: InstallAppInput): Promise<AuthSession> {
 *     const session = await super.execute(input); // exchange code → session
 *     const store = Store.fromAuthSession(session);
 *     await this.stores.upsertStore(store);       // idempotent UPSERT
 *     return session;                             // pass-through
 *   }
 * }
 * ```
 */
export abstract class InstallAppDecorator
  extends UseCaseDecorator<InstallAppInput, AuthSession>
  implements InstallAppUseCase
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override execute(input: InstallAppInput): Promise<AuthSession> {
    throw new Error('Method not implemented.');
  }
}
