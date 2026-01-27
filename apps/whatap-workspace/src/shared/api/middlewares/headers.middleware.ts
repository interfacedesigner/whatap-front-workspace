import type { Middleware } from 'openapi-fetch';

/**
 * 공통 HTTP 헤더 설정 미들웨어
 */
export function createHeadersMiddleware(): Middleware {
  return {
    async onRequest({ request }) {
      request.headers.set('Cache-Control', 'no-cache');
      request.headers.set('Accept', 'application/json');

      // Content-Type은 body가 있을 때만 설정
      if (request.body) {
        request.headers.set('Content-Type', 'application/json');
      }

      return request;
    },
  };
}
