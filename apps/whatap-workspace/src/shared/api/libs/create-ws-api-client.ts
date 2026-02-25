import createClient, { type Client } from 'openapi-fetch';

import type { paths } from '../generated/api.d.ts';
import {
  createAuthMiddleware,
  createErrorTransformMiddleware,
  createHeadersMiddleware,
  createLoggerMiddleware,
  createRetryableFetch,
} from '../middlewares';
import type { WsApiClientOptions } from '../types';

/**
 * 기본 클라이언트 옵션
 */
const DEFAULT_OPTIONS: WsApiClientOptions = {
  baseUrl: import.meta.env.VITE_API_URL,
  timeout: 60000,
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
  },
  auth: {
    tokenKey: 'auth_token',
  },
};

/**
 * WS API 클라이언트 팩토리
 *
 * @example
 * ```typescript
 * // 기본 클라이언트
 * const client = createWsApiClient();
 *
 * // 커스텀 설정
 * const customClient = createWsApiClient({
 *   retry: { maxRetries: 5 },
 *   auth: { getToken: () => sessionStorage.getItem('token') },
 * });
 *
 * // 재시도 비활성화
 * const noRetryClient = createWsApiClient({ retry: false });
 * ```
 */
export function createWsApiClient(options?: WsApiClientOptions): Client<paths> {
  const config: WsApiClientOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    retry: options?.retry === false ? false : { ...DEFAULT_OPTIONS.retry, ...(options?.retry || {}) },
    auth: options?.auth === false ? false : { ...DEFAULT_OPTIONS.auth, ...(options?.auth || {}) },
  };

  // 재시도 로직이 포함된 fetch 생성
  const fetchWithRetry =
    config.retry !== false ? createRetryableFetch(typeof config.retry === 'object' ? config.retry : undefined) : fetch;

  // 클라이언트 생성
  const client = createClient<paths>({
    baseUrl: config.baseUrl ?? '',
    fetch: fetchWithRetry,
  });

  // 미들웨어 등록 순서 중요
  // 1. 헤더 설정
  client.use(createHeadersMiddleware());

  // 2. 인증
  if (config.auth !== false) {
    client.use(createAuthMiddleware(typeof config.auth === 'object' ? config.auth : undefined));
  }

  // 3. 에러 변환
  client.use(createErrorTransformMiddleware());

  // 4. 로깅 (개발 환경)
  client.use(createLoggerMiddleware());

  // 5. 커스텀 미들웨어
  if (config.middlewares) {
    config.middlewares.forEach((m) => client.use(m));
  }

  return client;
}
