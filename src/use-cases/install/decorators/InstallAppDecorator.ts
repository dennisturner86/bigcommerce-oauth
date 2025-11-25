import type { InstallAppUseCase } from '@/use-cases/install/contracts/InstallAppUseCase.js';
import type { InstallAppInput } from '@/use-cases/install/dto/InstallAppInput.js';
import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { AuthSession } from '@/use-cases/shared/dto/AuthSession.js';
import type { InstallAppContext } from '../InstallAppContext.js';

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
 */
export abstract class InstallAppDecorator
  extends UseCaseDecorator<InstallAppInput, AuthSession, InstallAppContext>
  implements InstallAppUseCase {}
