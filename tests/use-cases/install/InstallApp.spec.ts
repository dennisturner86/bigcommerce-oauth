import { describe, expect, it, vi } from 'vitest';

import type { AuthSession, InstallAppInput, OAuthClient } from '@/index.js';
import { InstallApp } from '@/index.js';

describe('InstallApp', () => {
  const baseInput: InstallAppInput = {
    code: 'auth-code-123',
    context: 'stores/abcd',
    scope: 'store_v2_products',
    redirectUri: 'https://example.com/callback',
  };

  it('delegates to oauthClient.exchange with the correct arguments and returns the AuthSession', async () => {
    const authSession = {} as AuthSession;

    const oauthClient: OAuthClient = {
      exchange: vi.fn().mockResolvedValue(authSession),
    };

    const useCase = new InstallApp(oauthClient);

    const result = await useCase.execute(baseInput);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const exchange = oauthClient.exchange;

    expect(exchange).toHaveBeenCalledTimes(1);
    expect(exchange).toHaveBeenCalledWith(
      baseInput.code,
      baseInput.context,
      baseInput.scope,
      baseInput.redirectUri,
    );
    expect(result).toBe(authSession);
  });

  it('propagates errors thrown by oauthClient.exchange', async () => {
    const error = new Error('token exchange failed');

    const oauthClient: OAuthClient = {
      exchange: vi.fn().mockRejectedValue(error),
    };

    const useCase = new InstallApp(oauthClient);

    await expect(useCase.execute(baseInput)).rejects.toBe(error);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(oauthClient.exchange).toHaveBeenCalledTimes(1);
  });
});
