import type { Middleware } from 'openapi-fetch';

/**
 * 로깅 미들웨어
 *
 * 개발 환경에서만 요청/응답/에러를 로깅합니다.
 */
export function createLoggerMiddleware(enabled = process.env.NODE_ENV !== 'production'): Middleware {
  return {
    async onRequest({ request, schemaPath, id }) {
      if (enabled) {
        console.log(`[API Request] ${id}`, {
          method: request.method,
          url: request.url,
          path: schemaPath,
        });
      }
      return request;
    },

    async onResponse({ response, id }) {
      if (enabled) {
        console.log(`[API Response] ${id}`, {
          status: response.status,
          ok: response.ok,
        });
      }
      return response;
    },

    async onError({ error, id }) {
      if (enabled) {
        console.error(`[API Error] ${id}`, error);
      }
    },
  };
}
