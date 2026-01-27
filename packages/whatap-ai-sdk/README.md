# Whatap AI SDK

WhaTap 프론트엔드에서 AI 백엔드와 통신하기 위한 TypeScript SDK입니다.

## 기본 사용법

### SDK 초기화

```typescript
import { WhatapAISDK } from '@whatap/ai-sdk';

const sdk = new WhatapAISDK({
  maxBufferSize: 1024 * 1024, // 선택사항: 버퍼 크기 설정 (기본값: 1MB)
});
```

### 일반 메시지 전송

```typescript
const response = await sdk.chat.sendMessage({
  question: 'GPU 인벤토리 데이터를 조회해 줘',
  questionType: 'prompt',
});

console.log(response.answer);
```

### 스트리밍 메시지

```typescript
const subscription = sdk.chat.sendMessageStream({
  question: 'GPU 인벤토리 데이터를 조회해 줘',
  questionType: 'prompt',
});

subscription
  .subscribe((chunk) => {
    console.log(chunk.chunk); // 실시간으로 받은 텍스트 조각
    if (chunk.done) {
      console.log('스트림 완료');
    }
  })
  .onError((error) => {
    console.error('에러 발생:', error);
  })
  .onClose(() => {
    console.log('연결 종료');
  });

// 연결 종료
subscription.close();
```

## API 참조

### WhatapAISDK

#### 생성자 옵션

- `maxBufferSize?: number` - 스트림 버퍼 최대 크기 (기본값: 1MB)

### SendMessageParams

```typescript
{
  question: string; // 질문 내용
  questionType: 'prompt'; // 현재는 prompt 타입만 지원
}
```

### ChatResponse

```typescript
{
  answer: string;
  status: 'success' | 'error';
}
```

### ChatStreamResponse

```typescript
{
  status: 'success' | 'error';
  chunk: string; // 스트림 텍스트 조각
  done: boolean; // 스트림 완료 여부
}
```
