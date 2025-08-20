import { randomUUID } from 'crypto';
import type { AuthSession } from '@/use-cases/shared/dto/AuthSession';

export function buildAuthSession(partial: Partial<AuthSession> = {}): AuthSession {
  return {
    access_token: 'access_token_value',
    scope: 'products_read categories_read',
    context: 'stores/abc123',
    user: { id: 101, username: 'installer', email: 'installer@store.com' },
    owner: { id: 202, username: 'owner', email: 'owner@store.com' },
    ajs_anonymous_id: null,
    account_uuid: randomUUID(),
    ...partial,
  };
}
