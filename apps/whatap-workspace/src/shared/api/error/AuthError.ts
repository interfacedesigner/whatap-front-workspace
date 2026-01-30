import { WsApiError } from './WsApiError';

/**
 * 인증 에러 클래스 (401 Unauthorized)
 */
export class AuthError extends WsApiError {
  constructor(message = 'Unauthorized', requestId?: string) {
    super(message, { status: 401, requestId, payload: undefined });
    this.name = 'AuthError';
  }

  /**
   * 인증 에러는 재시도 불가
   */
  get isRetryable(): boolean {
    return false;
  }
}
