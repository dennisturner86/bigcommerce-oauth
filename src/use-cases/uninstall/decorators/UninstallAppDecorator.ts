import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { UninstallAppUseCase } from '@/use-cases/uninstall/contracts/UninstallAppUseCase.js';
import type { UninstallAppInput } from '@/use-cases/uninstall/dto/UninstallAppInput.js';
import type { UninstallContext } from '../UninstallContext.js';

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
 */
export abstract class UninstallAppDecorator<TContext extends UninstallContext = UninstallContext>
  extends UseCaseDecorator<UninstallAppInput, SignedPayloadClaims, TContext>
  implements UninstallAppUseCase {}
