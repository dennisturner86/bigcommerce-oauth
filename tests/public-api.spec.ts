import * as publicApi from '@/index.js';
import { describe, expect, it } from 'vitest';

describe('bigcommerce-oauth public API', () => {
  it('exports BigCommerceOAuthClient and verifier', () => {
    expect(typeof publicApi.BigCommerceOAuthClient).toBe('function');
    expect(typeof publicApi.BigCommerceSignedPayloadVerifier).toBe('function');
  });

  it('exports error types', () => {
    expect(publicApi.BigCommerceTokenExchangeError).toBeDefined();
    expect(publicApi.InvalidJwtSignatureError).toBeDefined();
    expect(publicApi.JwtLifetimeError).toBeDefined();
    expect(publicApi.MalformedJwtError).toBeDefined();
  });

  it('exports InstallApp use case and decorator', () => {
    expect(publicApi).toHaveProperty('InstallApp');
    expect(typeof publicApi.InstallApp).toBe('function');

    expect(publicApi).toHaveProperty('InstallAppDecorator');
    expect(typeof publicApi.InstallAppDecorator).toBe('function');
  });

  it('exports LoadApp use case and decorator', () => {
    expect(publicApi).toHaveProperty('LoadApp');
    expect(typeof publicApi.LoadApp).toBe('function');

    expect(publicApi).toHaveProperty('UninstallAppDecorator');
    expect(typeof publicApi.LoadAppDecorator).toBe('function');
  });

  it('exports UninstallApp use case and decorator', () => {
    expect(publicApi).toHaveProperty('UninstallApp');
    expect(typeof publicApi.UninstallApp).toBe('function');

    expect(publicApi).toHaveProperty('UninstallAppDecorator');
    expect(typeof publicApi.UninstallAppDecorator).toBe('function');
  });

  it('exports RemoveUser use case and decorator', () => {
    expect(publicApi).toHaveProperty('RemoveUser');
    expect(typeof publicApi.RemoveUser).toBe('function');

    expect(publicApi).toHaveProperty('RemoveUserDecorator');
    expect(typeof publicApi.RemoveUserDecorator).toBe('function');
  });

  it('exports shared UseCaseDecorator', () => {
    expect(publicApi).toHaveProperty('UseCaseDecorator');
    expect(typeof publicApi.UseCaseDecorator).toBe('function');
  });

  it('exports StoreHash value object', () => {
    expect(publicApi).toHaveProperty('StoreHash');
    expect(typeof publicApi.StoreHash).toBe('function');
  });

  it('exports InvalidStoreContextError', () => {
    expect(publicApi).toHaveProperty('InvalidStoreContextError');
    expect(typeof publicApi.InvalidStoreContextError).toBe('function');
  });
});
