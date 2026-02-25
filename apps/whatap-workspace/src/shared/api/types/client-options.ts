import type { Middleware } from 'openapi-fetch';

/**
 * 재시도 설정 옵션
 */
export interface RetryOptions {
  /** 최대 재시도 횟수 (기본값: 3) */
  maxRetries?: number;

  /** 초기 대기 시간 ms (기본값: 1000) */
  initialDelay?: number;

  /** 최대 대기 시간 ms (기본값: 30000) */
  maxDelay?: number;

  /** 재시도 대상 HTTP 상태 코드 (기본값: [500, 502, 503, 504]) */
  retryStatusCodes?: number[];

  /** 네트워크 에러 재시도 여부 (기본값: true) */
  retryOnNetworkError?: boolean;

  /** 재시도 조건 커스텀 함수 */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * 인증 설정 옵션
 */
export interface AuthOptions {
  /** 토큰 저장소 키 (기본값: 'auth_token') */
  tokenKey?: string;

  /** 토큰 가져오기 함수 */
  getToken?: () => string | null | Promise<string | null>;

  /** Authorization 헤더 포맷 (기본값: 'Bearer {token}') */
  headerFormat?: string;

  /** [확장] 토큰 갱신 함수 */
  refreshToken?: () => Promise<string | null>;

  /** [확장] 토큰 저장 함수 */
  setToken?: (token: string) => void | Promise<void>;
}

/**
 * WS API 클라이언트 설정 옵션
 */
export interface WsApiClientOptions {
  /** API 기본 URL (기본값: import.meta.env.VITE_API_URL) */
  baseUrl?: string;

  /** 기본 요청 타임아웃 ms (기본값: 60000) */
  timeout?: number;

  /** 재시도 설정 (false로 비활성화) */
  retry?: RetryOptions | false;

  /** 인증 설정 (false로 비활성화) */
  auth?: AuthOptions | false;

  /** 커스텀 미들웨어 */
  middlewares?: Middleware[];
}

/**
 * 재시도 설정 기본값
 */
export const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  retryStatusCodes: [500, 502, 503, 504],
  retryOnNetworkError: true,
  shouldRetry: () => true,
};

/**
 * 인증 설정 기본값
 */
export const DEFAULT_AUTH_OPTIONS: Required<Omit<AuthOptions, 'refreshToken' | 'setToken'>> = {
  tokenKey: 'auth_token',
  getToken: () => localStorage.getItem('auth_token'),
  headerFormat: 'Bearer {token}',
};
