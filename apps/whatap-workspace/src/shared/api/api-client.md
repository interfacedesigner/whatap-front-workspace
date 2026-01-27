# WS API Client 설계 문서

## 개요

OpenAPI 기반 타입 안전 API 클라이언트. `openapi-fetch` 라이브러리를 사용하며, 미들웨어 패턴으로 인증, 재시도, 에러 처리를 구현합니다.

---

## 인터페이스 명세

### WsApiClientOptions

```typescript
interface WsApiClientOptions {
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
```

### RetryOptions

```typescript
interface RetryOptions {
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
```

### AuthOptions

```typescript
interface AuthOptions {
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
```

---

## 에러 클래스 계층 구조

```
WsApiError (base)
├── AuthError (401 Unauthorized)
├── NetworkError (fetch 실패, 네트워크 단절)
├── TimeoutError (요청 타임아웃)
└── AbortError (요청 취소)
```

### WsApiError

```typescript
class WsApiError extends Error {
  readonly status?: number;      // HTTP 상태 코드
  readonly payload?: unknown;    // 응답 본문
  readonly requestId?: string;   // 요청 식별자

  get isRetryable(): boolean;    // 재시도 가능 여부
}
```

### 에러 판별

```typescript
import { WsApiError, AuthError, NetworkError, AbortError } from '@shared/api/error';

if (error instanceof AuthError) {
  // 로그인 페이지로 리다이렉트
}

if (error instanceof NetworkError) {
  // 네트워크 연결 확인 메시지
}

if (error instanceof AbortError) {
  // 요청 취소됨 (무시 가능)
}

if (error instanceof WsApiError && error.isRetryable) {
  // 재시도 가능한 에러
}
```

---

## 미들웨어 구조

### 실행 순서

```
요청 → headers → auth → [fetch with retry] → error-transform → logger → 응답
```

### 1. headers.middleware

- `Cache-Control: no-cache`
- `Accept: application/json`
- `Content-Type: application/json` (body 있을 때만)

### 2. auth.middleware

- localStorage에서 토큰 읽기
- `Authorization: Bearer {token}` 헤더 설정
- 401 응답 시 `AuthError` throw

### 3. retry.middleware (fetch wrapper)

- Exponential backoff with jitter
- 5xx 상태 코드 재시도
- 네트워크 에러 재시도
- AbortError는 재시도하지 않음

### 4. error-transform.middleware

- HTTP 에러 응답 → `WsApiError` 변환
- 네트워크 에러 → `NetworkError` 변환
- AbortError → `AbortError` 변환

### 5. logger.middleware

- 개발 환경에서만 활성화
- 요청/응답/에러 로깅

---

## 사용 예시

### 기본 사용

```typescript
import apiClient from '@shared/api/libs/ws-api-client';

const { data, error } = await apiClient.GET('/ws/api/v1/{enterprise}/workspace/{workspaceId}', {
  params: {
    path: { enterprise: 'whatap', workspaceId: '123' },
  },
});

if (error) {
  // 에러 처리
  return;
}

// data 사용
```

### AbortController 사용

```typescript
const controller = new AbortController();

// 컴포넌트 언마운트 시 취소
useEffect(() => {
  return () => controller.abort();
}, []);

const { data, error } = await apiClient.GET('/ws/api/v1/yard', {
  signal: controller.signal,
});

if (error instanceof AbortError) {
  // 취소됨, 무시
  return;
}
```

### 커스텀 클라이언트 생성

```typescript
import { createWsApiClient } from '@shared/api/libs/create-ws-api-client';

const customClient = createWsApiClient({
  retry: {
    maxRetries: 5,
    initialDelay: 500,
  },
  auth: {
    getToken: () => sessionStorage.getItem('custom_token'),
  },
});
```

### 재시도 비활성화

```typescript
const noRetryClient = createWsApiClient({
  retry: false,
});
```

---

## 파일 구조

```
src/shared/api/
├── api-client.md              # 이 문서
├── types/
│   ├── index.ts
│   └── client-options.ts      # 설정 인터페이스
├── error/
│   ├── index.ts               # 에러 내보내기
│   ├── WsApiError.ts          # 기본 에러
│   ├── AuthError.ts           # 인증 에러
│   ├── NetworkError.ts        # 네트워크 에러
│   ├── TimeoutError.ts        # 타임아웃 에러
│   └── AbortError.ts          # 취소 에러
├── middlewares/
│   ├── index.ts               # 미들웨어 내보내기
│   ├── auth.middleware.ts
│   ├── retry.middleware.ts
│   ├── error-transform.middleware.ts
│   ├── headers.middleware.ts
│   └── logger.middleware.ts
└── libs/
    ├── ws-api-client.ts       # 기본 싱글톤
    └── create-ws-api-client.ts # 팩토리 함수
```

---

## 확장 가이드

### 토큰 갱신 추가

`auth.middleware.ts`의 `AuthOptions`에 `refreshToken`, `setToken` 구현:

```typescript
const client = createWsApiClient({
  auth: {
    refreshToken: async () => {
      const response = await fetch('/api/auth/refresh');
      const { token } = await response.json();
      return token;
    },
    setToken: (token) => {
      localStorage.setItem('auth_token', token);
    },
  },
});
```

### 에러 포맷 변경 대응

`error-transform.middleware.ts`의 `extractErrorMessage` 함수 수정:

```typescript
function extractErrorMessage(payload: unknown): string {
  // 새 포맷 대응
  if (payload?.error?.message) {
    return payload.error.message;
  }
  // 기존 포맷
  return payload?.msg ?? payload?.message ?? 'Unknown error';
}
```

---

## 기본값

| 옵션 | 기본값 |
|------|--------|
| baseUrl | `import.meta.env.VITE_API_URL` |
| timeout | 60000 |
| retry.maxRetries | 3 |
| retry.initialDelay | 1000 |
| retry.maxDelay | 30000 |
| retry.retryStatusCodes | [500, 502, 503, 504] |
| retry.retryOnNetworkError | true |
| auth.tokenKey | 'auth_token' |
| auth.headerFormat | 'Bearer {token}' |
