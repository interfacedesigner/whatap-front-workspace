import { WsApiError } from './WsApiError';

/**
 * 요청 취소 에러 클래스
 *
 * AbortController로 요청이 취소되었을 때 발생합니다.
 */
export class AbortError extends WsApiError {
  constructor(requestId?: string) {
    super('Request aborted', { requestId, status: undefined, payload: undefined });
    this.name = 'AbortError';
  }

  /**
   * 취소된 요청은 재시도 불가
   */
  get isRetryable(): boolean {
    return false;
  }
}
