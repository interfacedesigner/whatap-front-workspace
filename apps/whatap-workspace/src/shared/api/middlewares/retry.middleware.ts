import type { RetryOptions } from '../types';
import { DEFAULT_RETRY_OPTIONS } from '../types';

/**
 * Exponential backoff with jitter 계산
 */
function calculateDelay(attempt: number, initialDelay: number, maxDelay: number): number {
  const exponentialDelay = initialDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * 재시도 가능한 에러인지 판단
 */
function isRetryableError(error: unknown, statusCode: number | undefined, config: Required<RetryOptions>): boolean {
  // AbortError는 재시도하지 않음
  if (error instanceof Error && error.name === 'AbortError') {
    return false;
  }

  // HTTP 상태 코드 기반 재시도
  if (statusCode !== undefined && config.retryStatusCodes.includes(statusCode)) {
    return true;
  }

  // 네트워크 에러 (fetch 실패)
  if (config.retryOnNetworkError) {
    if (error instanceof TypeError) {
      return true;
    }
    if (error instanceof Error && error.message === 'Failed to fetch') {
      return true;
    }
  }

  return false;
}

/**
 * 재시도 로직이 포함된 fetch 래퍼 생성
 *
 * openapi-fetch의 middleware.onError에서는 재요청이 어려워서
 * fetch 함수 자체를 래핑하는 방식을 사용합니다.
 */
export function createRetryableFetch(options?: RetryOptions): typeof fetch {
  const config: Required<RetryOptions> = { ...DEFAULT_RETRY_OPTIONS, ...options };

  return async function retryableFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const response = await fetch(input, init);

        // 재시도 대상 상태 코드인 경우
        if (config.retryStatusCodes.includes(response.status)) {
          // 커스텀 조건 확인
          if (!config.shouldRetry(response, attempt)) {
            return response;
          }

          // 마지막 시도가 아니면 재시도
          if (attempt < config.maxRetries) {
            const delay = calculateDelay(attempt, config.initialDelay, config.maxDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // AbortError는 재시도하지 않음
        if (lastError.name === 'AbortError') {
          throw lastError;
        }

        // 재시도 가능 여부 확인
        const shouldRetry =
          isRetryableError(error, undefined, config) && config.shouldRetry(error, attempt) && attempt < config.maxRetries;

        if (shouldRetry) {
          const delay = calculateDelay(attempt, config.initialDelay, config.maxDelay);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError ?? new Error('Max retries exceeded');
  };
}
