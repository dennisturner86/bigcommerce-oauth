import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { BigCommerceOAuthClient } from '@/gateways/BigCommerce/BigCommerceOAuthClient.js';
import { BigCommerceTokenExchangeError } from '@/gateways/BigCommerce/errors/BigCommerceTokenExchangeError.js';
import { buildAuthSession } from 'tests/utils/builders.js';
import { mockFetchError, mockFetchOk, mockFetchReject } from 'tests/utils/helpers.js';

const TOKEN_URL = 'https://login.bigcommerce.com/oauth2/token';

describe('BigCommerceOAuthClient', () => {
  const clientId = 'test_client_id';
  const clientSecret = 'test_client_secret';

  const code = 'auth_code_123';
  const context = 'stores/abc123';
  const scope = 'products_read categories_read';
  const redirectUri = 'https://app.example.com/oauth/callback';

  const session = buildAuthSession();

  let fetchSpy: ReturnType<typeof vi.spyOn>;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the correct POST request with headers and body', async () => {
    fetchSpy = mockFetchOk(session);

    const client = new BigCommerceOAuthClient(clientId, clientSecret);
    await client.exchange(code, context, scope, redirectUri);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(TOKEN_URL);

    // method + headers
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });

    // body contents
    const body = JSON.parse(init!.body as string);
    expect(body).toEqual({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      context,
      scope,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });
  });

  it('returns parsed AuthSession on success', async () => {
    fetchSpy = mockFetchOk(session);

    const client = new BigCommerceOAuthClient(clientId, clientSecret);
    const result = await client.exchange(code, context, scope, redirectUri);

    expect(result).toEqual(session);
  });

  it('throws BigCommerceTokenExchangeError on non-2xx response', async () => {
    fetchSpy = mockFetchError(401, 'Unauthorized');

    const client = new BigCommerceOAuthClient(clientId, clientSecret);
    const err = await client.exchange(code, context, scope, redirectUri).catch((e) => e);

    expect(err).toBeInstanceOf(BigCommerceTokenExchangeError);
    expect(err).toMatchObject({ status: 401, statusText: 'Unauthorized' });
  });

  it('propagates network errors (fetch rejection)', async () => {
    const errorMessage = 'network error';
    fetchSpy = mockFetchReject(errorMessage);

    const client = new BigCommerceOAuthClient(clientId, clientSecret);

    await expect(client.exchange(code, context, scope, redirectUri)).rejects.toThrow(errorMessage);
  });
});
