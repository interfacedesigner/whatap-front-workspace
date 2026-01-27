import { WsApiError } from './WsApiError';

/**
 * 네트워크 에러 클래스
 *
 * fetch 실패, 네트워크 단절 등의 상황에서 발생합니다.
 */
export class NetworkError extends WsApiError {
  public readonly originalError: Error;

  constructor(originalError: Error, requestId?: string) {
    super('Network error', { requestId });
    this.name = 'NetworkError';
    this.originalError = originalError;
  }

  /**
   * 네트워크 에러는 재시도 가능
   */
  get isRetryable(): boolean {
    return true;
  }
}
