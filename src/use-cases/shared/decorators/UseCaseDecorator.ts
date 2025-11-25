import type { UseCase } from '../contracts/UseCase.js';

/**
 * Generic base class for implementing the **Decorator** pattern around a use case.
 *
 * @typeParam TIn  Input DTO type accepted by the `execute` method.
 * @typeParam TOut Output type (or Promise value) returned by the `execute` method.
 * @typeParam TContext Optional, per-execution context object used to pass
 *
 * Extend this class when you need to add cross-cutting behavior (logging,
 * persistence, notifications, etc.) around a core use case implementation.
 */
export abstract class UseCaseDecorator<TIn, TOut, TContext = void> {
  /**
   * @param inner The wrapped use case instance to which calls will be delegated.
   */
  protected constructor(protected readonly inner: UseCase<TIn, TOut, TContext>) {}

  /**
   * Default implementation: simply forwards the call to the wrapped use case.
   * Override in subclasses to add pre-/post-processing around the core logic.
   *
   * @param input The input DTO passed to the wrapped use case.
   * @returns A promise resolving to the wrapped use case’s result.
   */
  execute(input: TIn, context: TContext): Promise<TOut> {
    return this.inner.execute(input, context);
  }
}
