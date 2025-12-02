import {
  LoadApp,
  type LoadAppInput,
  type SignedPayloadClaims,
  type SignedPayloadVerifier,
} from '@/index.js';
import { describe, expect, it, vi } from 'vitest';

describe('LoadApp', () => {
  const baseInput: LoadAppInput = {
    signedPayloadJwt: 'header.payload.signature',
  } as LoadAppInput;

  it('delegates to verifier.verify with the correct JWT and returns the claims', async () => {
    const claims: SignedPayloadClaims = {} as SignedPayloadClaims;

    const verifyMock = vi.fn<(jwt: string) => SignedPayloadClaims>().mockReturnValue(claims);

    const verifier: SignedPayloadVerifier = {
      verify: verifyMock,
    };

    const useCase = new LoadApp(verifier);

    const result = await useCase.execute(baseInput);

    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(verifyMock).toHaveBeenCalledWith(baseInput.signedPayloadJwt);
    expect(result).toBe(claims);
  });

  it('propagates errors thrown by verifier.verify as rejected promises', async () => {
    const verifyError = new Error('invalid jwt');

    const verifyMock = vi.fn<(jwt: string) => SignedPayloadClaims>().mockImplementation(() => {
      throw verifyError;
    });

    const verifier: SignedPayloadVerifier = {
      verify: verifyMock,
    };

    const useCase = new LoadApp(verifier);

    await expect(useCase.execute(baseInput)).rejects.toBe(verifyError);
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(verifyMock).toHaveBeenCalledWith(baseInput.signedPayloadJwt);
  });
});
