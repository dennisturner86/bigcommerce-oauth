import { describe, expectTypeOf, it } from 'vitest';

import type {
  AuthSession,
  InstallAppContext,
  InstallAppInput,
  InstallAppUseCase,
  LoadAppContext,
  LoadAppInput,
  LoadAppUseCase,
  OAuthClient,
  RemoveUserContext,
  RemoveUserInput,
  RemoveUserUseCase,
  SignedPayloadClaims,
  SignedPayloadVerifier,
  UninstallAppContext,
  UninstallAppInput,
  UninstallAppUseCase,
  UseCase,
} from '@/index.js';

describe('bigcommerce-oauth type public API', () => {
  it('exports InstallApp types', () => {
    expectTypeOf<InstallAppInput>().toBeObject();
    expectTypeOf<InstallAppContext>().toBeObject();
    expectTypeOf<InstallAppUseCase>().toBeObject();
    expectTypeOf<OAuthClient>().toBeObject();
  });

  it('exports LoadApp types', () => {
    expectTypeOf<LoadAppInput>().toBeObject();
    expectTypeOf<LoadAppContext>().toBeObject();
    expectTypeOf<LoadAppUseCase>().toBeObject();
  });

  it('exports UninstallApp types', () => {
    expectTypeOf<UninstallAppInput>().toBeObject();
    expectTypeOf<UninstallAppContext>().toBeObject();
    expectTypeOf<UninstallAppUseCase>().toBeObject();
  });

  it('exports RemoveUser types', () => {
    expectTypeOf<RemoveUserInput>().toBeObject();
    expectTypeOf<RemoveUserContext>().toBeObject();
    expectTypeOf<RemoveUserUseCase>().toBeObject();
  });

  it('exports shared contracts', () => {
    expectTypeOf<SignedPayloadVerifier>().toBeObject();
    expectTypeOf<UseCase<object, object>>().toBeObject();
  });

  it('exports shared DTOs', () => {
    expectTypeOf<AuthSession>().toBeObject();
    expectTypeOf<SignedPayloadClaims>().toBeObject();
  });
});
