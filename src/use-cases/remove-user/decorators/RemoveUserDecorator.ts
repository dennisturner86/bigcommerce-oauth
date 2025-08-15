import type { RemoveUserUseCase } from '@/use-cases/remove-user/contracts/RemoveUserUseCase';
import type { RemoveUserInput } from '@/use-cases/remove-user/dto/RemoveUserInput';
import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims';

/**
 * Base class for **Remove User**-flow decorators.
 *
 * Extend this to add cross-cutting behavior around a {@link RemoveUserUseCase}
 * implementation while preserving the same contract. Typical examples:
 * - Removing/inactivating the user in persistence
 * - Emitting telemetry/metrics
 * - Sending notifications/audit logs
 * - Idempotency / locking
 *
 * This class delegates to the wrapped implementation by default; override
 * `execute` to add pre-/post-logic.
 *
 * @example
 * ```ts
 * export class RemoveUserFromStore extends RemoveUserDecorator {
 *   constructor(
 *     inner: RemoveUserUseCase,
 *     private readonly users: UserRepository
 *   ) { super(inner); }
 *
 *   async execute(input: RemoveUserInput): Promise<SignedPayloadClaims> {
 *     const claims = await super.execute(input); // verify & decode
 *     const storeHash = StoreHash.fromJWTSub(claims.sub);
 *     await this.users.removeUser(claims.user.id, storeHash);
 *     return claims;
 *   }
 * }
 * ```
 */
export abstract class RemoveUserDecorator
  extends UseCaseDecorator<RemoveUserInput, SignedPayloadClaims>
  implements RemoveUserUseCase {}
