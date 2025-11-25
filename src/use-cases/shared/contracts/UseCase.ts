/**
 * Generic Clean Architecture use-case contract.
 *
 * A `UseCase` represents a single application-specific interaction
 * (sometimes called an *interactor*). It transforms an input DTO into an
 * output DTO while remaining fully independent of frameworks, transport
 * layers, and storage mechanisms.
 *
 * @typeParam TIn - Input DTO containing the data required to execute the use case.
 * @typeParam TOut — Output DTO produced by the use case (typically returned to a controller).
 * @typeParam TContext — Optional, per-execution context object used to pass
 *   cross-cutting or pipeline-specific data (e.g., requestId, logger,
 *   telemetry span, shared decorator state). Defaults to `void` for use cases
 *   that do not require context.
 *
 * ### Notes
 * - `context` is **NOT** a domain entity or value object.
 *   It is an **application-layer orchestration object** that lives only for
 *   a single execution of a use case.
 * - Decorators may read from or write to `context` to compose behaviors such
 *   as telemetry, idempotency, persistence, and side-effect coordination.
 */
export interface UseCase<TIn, TOut, TContext = void> {
  /**
   * Execute the use case with the given input and optional execution context.
   *
   * @param input - The transport-agnostic input DTO.
   * @param context - A per-request context object used for cross-cutting concerns.
   * @returns A promise resolving to the use case's output DTO.
   */
  execute(input: TIn, context: TContext): Promise<TOut>;
}
