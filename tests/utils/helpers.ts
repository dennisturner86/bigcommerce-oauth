import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

export const mockFetchOk = (body: unknown) =>
  vi
    .spyOn(globalThis, 'fetch' as any)
    .mockResolvedValueOnce({ ok: true, json: async () => body } as any);

export const mockFetchError = (status: number, statusText: string) =>
  vi
    .spyOn(globalThis, 'fetch' as any)
    .mockResolvedValueOnce({ ok: false, status, statusText } as any);

export const mockFetchReject = (message: string) =>
  vi.spyOn(globalThis, 'fetch' as any).mockRejectedValueOnce(new Error(message));
