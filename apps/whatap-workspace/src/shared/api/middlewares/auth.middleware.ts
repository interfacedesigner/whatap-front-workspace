import type { Middleware } from 'openapi-fetch';

import { AuthError } from '../error';
import type { AuthOptions } from '../types';
import { DEFAULT_AUTH_OPTIONS } from '../types';

type ResolvedAuthOptions = Required<Omit<AuthOptions, 'refreshToken' | 'setToken'>> &
  Pick<AuthOptions, 'refreshToken' | 'setToken'>;

/**
 * 인증 미들웨어
 *
 * - localStorage에서 토큰 읽기
 * - Authorization 헤더 설정
 * - 401 응답 시 AuthError throw
 */
export function createAuthMiddleware(options?: AuthOptions): Middleware {
  const config: ResolvedAuthOptions = { ...DEFAULT_AUTH_OPTIONS, ...options };

  return {
    async onRequest({ request }) {
      const token = await config.getToken();

      if (token) {
        const headerValue = config.headerFormat.replace('{token}', token);
        request.headers.set('Authorization', headerValue);
      }

      return request;
    },

    async onResponse({ response, id }) {
      if (response.status === 401) {
        throw new AuthError('Unauthorized', id);
      }
      return response;
    },
  };
}
