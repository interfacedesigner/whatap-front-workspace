/**
 * API 에러 옵션
 */
export interface WsApiErrorOptions {
  /** HTTP 상태 코드 */
  status?: number;
  /** 응답 페이로드 */
  payload?: unknown;
  /** 요청 식별자 */
  requestId?: string;
}

/**
 * 기본 API 에러 클래스
 *
 * 모든 API 관련 에러의 기본 클래스입니다.
 */
export class WsApiError extends Error {
  public readonly status?: number;
  public readonly payload?: unknown;
  public readonly requestId?: string;

  constructor(message: string, options?: WsApiErrorOptions) {
    super(message);
    this.name = 'WsApiError';
    this.status = options?.status;
    this.payload = options?.payload;
    this.requestId = options?.requestId;

    // Error 클래스 상속 시 prototype chain 유지
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * 재시도 가능 여부
   * 5xx 에러는 재시도 가능
   */
  get isRetryable(): boolean {
    return this.status !== undefined && this.status >= 500;
  }
}
