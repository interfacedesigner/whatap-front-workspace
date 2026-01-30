import { WsApiError } from './WsApiError';

/**
 * 타임아웃 에러 클래스
 *
 * 요청 시간 초과 시 발생합니다.
 */
export class TimeoutError extends WsApiError {
  constructor(requestId?: string) {
    super('Request timeout', { requestId, status: undefined, payload: undefined });
    this.name = 'TimeoutError';
  }

  /**
   * 타임아웃 에러는 재시도 가능
   */
  get isRetryable(): boolean {
    return true;
  }
}
