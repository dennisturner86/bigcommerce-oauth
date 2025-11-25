import { UseCaseDecorator } from '@/use-cases/shared/decorators/UseCaseDecorator.js';
import type { SignedPayloadClaims } from '@/use-cases/shared/dto/SignedPayloadClaims.js';
import type { LoadAppUseCase } from '../contracts/LoadAppUseCase.js';
import type { LoadAppInput } from '../dto/LoadAppInput.js';
import type { LoadAppContext } from '../LoadAppContext.js';

/**
 * Base class for **Load**-flow decorators.
 *
 * Extend this to add cross-cutting behavior around an {@link LoadAppUseCase}
 * implementation while preserving the same contract.
 *
 * This class delegates to the wrapped implementation by default; override
 * `execute` to add pre-/post-logic.
 */
export abstract class LoadAppDecorator
  extends UseCaseDecorator<LoadAppInput, SignedPayloadClaims, LoadAppContext>
  implements LoadAppUseCase {}
