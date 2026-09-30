import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createApiInstance } from '../api.js';

describe('API Client - Error Handling Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests error handling', () => {
    it('should throw error for 404 response', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.getConstants()).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4471/api/constants');
    });

    it('should throw error for 500 response', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.getHeroes()).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4471/api/heroes');
    });

    it('should throw error for network errors', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getConstants()).rejects.toThrow('Network error');
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4471/api/constants');
    });

    it('should throw error for custom URL', async () => {
      const customUrl = 'http://custom:4471/api';
      const api = createApiInstance(customUrl);
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.getHeroes()).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith(`${customUrl}/heroes`);
    });
  });

  describe('POST requests error handling', () => {
    it('should throw error for validation errors', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.createHero({ name: 'test' })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:4471/api/heroes',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('should throw error for 500 on POST', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.createConstant({ name: 'test' })).rejects.toThrow();
    });
  });

  describe('PUT requests error handling', () => {
    it('should throw error for 404 on update', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.updateHero('1', { name: 'updated' })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4471/api/heroes/1', expect.objectContaining({ method: 'PUT' }));
    });

    it('should throw error for 500 on update', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.updateConstant(1, { name: 'updated' })).rejects.toThrow();
    });
  });

  describe('DELETE requests error handling', () => {
    it('should throw error for 404 on delete', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.deleteHero('1')).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4471/api/heroes/1', expect.objectContaining({ method: 'DELETE' }));
    });

    it('should throw error for 500 on delete', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        redirected: false
      } as any);

      await expect(api.deleteConstant(1)).rejects.toThrow();
    });
  });

  describe('Response parsing errors', () => {
    it('should throw error when response is not JSON', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        json: async () => { throw new Error('Invalid JSON'); }
      } as any);

      await expect(api.getConstants()).rejects.toThrow('Invalid JSON');
    });

    it('should throw error for malformed JSON', async () => {
      const api = createApiInstance();
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        json: async () => { throw new SyntaxError('Unexpected token'); }
      } as any);

      await expect(api.getHeroes()).rejects.toThrow();
    });
  });
});