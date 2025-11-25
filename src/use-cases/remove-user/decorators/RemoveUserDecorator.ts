import type { RemoveUserUseCase } from '@/use-cases/remove-user/contracts/RemoveUserUseCase.js';
import type { RemoveUserInput } from '@/use-cases/remove-user/dto/RemoveUserInput.js';
import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { RemoveUserContext } from '../RemoveUserContext.js';

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
 */
export abstract class RemoveUserDecorator<TContext extends RemoveUserContext = RemoveUserContext>
  extends UseCaseDecorator<RemoveUserInput, SignedPayloadClaims, TContext>
  implements RemoveUserUseCase {}
