import type { Middleware } from 'openapi-fetch';

import { WsApiError, NetworkError, AbortError, TimeoutError } from '../error';

/**
 * 백엔드 에러 응답 포맷 (유연하게 설계)
 */
interface ApiErrorResponse {
  msg?: string;
  message?: string;
  code?: number;
  error?: string | { message: string };
  data?: unknown;
  ok?: boolean;
}

/**
 * 에러 응답에서 메시지 추출
 */
function extractErrorMessage(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload === 'object' && payload !== null) {
    const p = payload as ApiErrorResponse;

    // 중첩된 error 객체 처리
    if (p.error && typeof p.error === 'object' && 'message' in p.error) {
      return p.error.message;
    }

    // 단순 error 문자열
    if (typeof p.error === 'string') {
      return p.error;
    }

    return p.msg ?? p.message ?? 'Unknown error';
  }

  return 'Unknown error';
}

/**
 * 에러 변환 미들웨어
 *
 * - HTTP 에러 응답 → WsApiError 변환
 * - 네트워크 에러 → NetworkError 변환
 * - AbortError → AbortError 변환
 */
export function createErrorTransformMiddleware(): Middleware {
  return {
    async onResponse({ response, id }) {
      // 성공 응답은 그대로 통과
      if (response.ok) {
        return response;
      }

      // 에러 응답 파싱
      let payload: unknown;
      try {
        payload = await response.clone().json();
      } catch {
        try {
          payload = await response.clone().text();
        } catch {
          payload = undefined;
        }
      }

      const message = extractErrorMessage(payload);

      throw new WsApiError(message, {
        status: response.status,
        payload,
        requestId: id,
      });
    },

    async onError({ error, id }) {
      // 이미 WsApiError 계열이면 그대로 반환
      if (error instanceof WsApiError) {
        return error;
      }

      // AbortError 변환
      if (error instanceof Error && error.name === 'AbortError') {
        return new AbortError(id);
      }

      // TimeoutError 변환
      if (error instanceof Error && error.name === 'TimeoutError') {
        return new TimeoutError(id);
      }

      // 네트워크 에러 변환
      if (error instanceof TypeError || (error instanceof Error && error.message === 'Failed to fetch')) {
        return new NetworkError(error, id);
      }

      // 기타 에러
      return new WsApiError(error instanceof Error ? error.message : String(error), { requestId: id });
    },
  };
}
