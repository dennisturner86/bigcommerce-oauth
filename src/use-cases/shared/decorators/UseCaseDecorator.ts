/**
 * Generic base class for implementing the **Decorator** pattern around a use case.
 *
 * @typeParam TIn  Input DTO type accepted by the `execute` method.
 * @typeParam TOut Output type (or Promise value) returned by the `execute` method.
 *
 * Extend this class when you need to add cross-cutting behavior (logging,
 * persistence, notifications, etc.) around a core use case implementation.
 *
 * Example:
 * ```ts
 * class DeactivateStore extends UseCaseDecorator<UninstallAppInput, SignedPayloadClaims> {
 *   async execute(input: UninstallAppInput): Promise<SignedPayloadClaims> {
 *     const claims = await super.execute(input);
 *     await this.storeRepo.deactivate(claims.storeHash);
 *     return claims;
 *   }
 * }
 * ```
 */
export abstract class UseCaseDecorator<TIn, TOut> {
  /**
   * @param inner The wrapped use case instance to which calls will be delegated.
   */
  protected constructor(protected readonly inner: { execute(input: TIn): Promise<TOut> }) {}

  /**
   * Default implementation: simply forwards the call to the wrapped use case.
   * Override in subclasses to add pre-/post-processing around the core logic.
   *
   * @param input The input DTO passed to the wrapped use case.
   * @returns A promise resolving to the wrapped use case’s result.
   */
  execute(input: TIn): Promise<TOut> {
    return this.inner.execute(input);
  }
}
