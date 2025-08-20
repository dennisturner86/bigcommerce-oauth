import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { UninstallAppUseCase } from '@/use-cases/uninstall/contracts/UninstallAppUseCase.js';
import type { UninstallAppInput } from '@/use-cases/uninstall/dto/UninstallAppInput.js';

/**
 * Base class for **Uninstall**-flow decorators.
 *
 * Extend this to add cross-cutting behavior around an {@link UninstallAppUseCase}
 * while preserving the same contract. Typical examples include:
 * - Deactivating the store in persistence
 * - Emitting telemetry/metrics
 * - Sending notifications/audit logs
 * - Adding idempotency / locking
 *
 * This class delegates to the wrapped implementation by default; override
 * `execute` in your subclass to add pre-/post-logic.
 *
 * @example
 * ```ts
 * export class DeactivateStore extends UninstallAppDecorator {
 *   constructor(
 *     inner: UninstallAppUseCase,
 *     private readonly stores: StoreRepository
 *   ) { super(inner); }
 *
 *   async execute(input: UninstallAppInput): Promise<SignedPayloadClaims> {
 *     const claims = await super.execute(input); // verify & decode
 *     const storeHash = StoreHash.fromJWTSub(claims.sub);
 *     await this.stores.deactivateStore(storeHash);
 *     return claims; // keep passing claims down the chain
 *   }
 * }
 * ```
 */
export abstract class UninstallAppDecorator
  extends UseCaseDecorator<UninstallAppInput, SignedPayloadClaims>
  implements UninstallAppUseCase {}
