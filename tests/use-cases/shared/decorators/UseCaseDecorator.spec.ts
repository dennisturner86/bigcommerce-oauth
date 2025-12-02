import type { UseCase } from '@/index.js';
import { UseCaseDecorator } from '@/index.js';
import { describe, expect, it, vi } from 'vitest';

// A concrete subclass to test behavior.
// It adds no extra logic and simply inherits default behavior.
class TestDecorator extends UseCaseDecorator<In, Out, Ctx> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(inner: UseCase<In, Out, Ctx>) {
    super(inner);
  }
}

// Example types to validate generics work end-to-end.
interface In {
  value: number;
}
interface Out {
  result: string;
}
interface Ctx {
  traceId: string;
}

describe('UseCaseDecorator', () => {
  it('delegates execute() to the wrapped use case', async () => {
    const input: In = { value: 123 };
    const context: Ctx = { traceId: 'abc-123' };
    const output: Out = { result: 'ok' };

    const executeMock = vi
      .fn<(input: In, context: Ctx) => Promise<Out>>()
      .mockResolvedValue(output);

    const inner: UseCase<In, Out, Ctx> = {
      execute: executeMock,
    };

    const decorator = new TestDecorator(inner);

    const result = await decorator.execute(input, context);

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock).toHaveBeenCalledWith(input, context);
    expect(result).toBe(output);
  });
});
