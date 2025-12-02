// StoreHash.spec.ts
import { InvalidStoreContextError, StoreHash } from '@/index.js';
import { describe, expect, it } from 'vitest';

describe('StoreHash', () => {
  // ------------------------------------------------------
  // from()
  // ------------------------------------------------------
  describe('from(hash)', () => {
    it('creates a StoreHash for a valid hash', () => {
      const hash = 'abc123';
      const sh = StoreHash.from(hash);

      expect(sh.toString()).toBe(hash);
    });

    it('throws InvalidStoreContextError for empty or short hash', () => {
      expect(() => StoreHash.from('')).toThrow(InvalidStoreContextError);
      expect(() => StoreHash.from('a')).toThrow(InvalidStoreContextError);
      expect(() => StoreHash.from('ab')).toThrow(InvalidStoreContextError);
    });

    it('throws InvalidStoreContextError for too long hash', () => {
      const long = 'x'.repeat(65);
      expect(() => StoreHash.from(long)).toThrow(InvalidStoreContextError);
    });
  });

  // ------------------------------------------------------
  // fromJWTSub()
  // ------------------------------------------------------
  describe('fromJWTSub(sub)', () => {
    it('creates a StoreHash from valid JWT sub', () => {
      const sub = 'stores/abc123';
      const sh = StoreHash.fromJWTSub(sub);

      expect(sh.toString()).toBe('abc123');
    });

    it('accepts underscores and hyphens in hash', () => {
      const sub = 'stores/abc_123-XYZ';
      const sh = StoreHash.fromJWTSub(sub);

      expect(sh.toString()).toBe('abc_123-XYZ');
    });

    it('throws InvalidStoreContextError for malformed sub', () => {
      const invalidSubs = [
        'abc123', // missing "stores/"
        'stores/', // missing hash
        'stores/ab', // too short
        'stores/' + 'x'.repeat(65), // too long
        'stores/@@@', // invalid chars
      ];

      for (const sub of invalidSubs) {
        expect(() => StoreHash.fromJWTSub(sub)).toThrow(InvalidStoreContextError);
      }
    });
  });

  // ------------------------------------------------------
  // toString()
  // ------------------------------------------------------
  describe('toString()', () => {
    it('returns the raw hash value', () => {
      const sh = StoreHash.from('abc123');
      expect(sh.toString()).toBe('abc123');
    });
  });

  // ------------------------------------------------------
  // equals()
  // ------------------------------------------------------
  describe('equals()', () => {
    it('returns true for same hash values', () => {
      const a = StoreHash.from('abc123');
      const b = StoreHash.from('abc123');

      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different hash values', () => {
      const a = StoreHash.from('abc123');
      const b = StoreHash.from('xyz456');

      expect(a.equals(b)).toBe(false);
    });
  });
});
