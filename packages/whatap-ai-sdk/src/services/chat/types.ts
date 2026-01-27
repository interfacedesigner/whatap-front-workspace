/**
 * @description 질문의 종류
 * - ask: 일반 질문
 * - screenshot: 스크린샷을 포함한 질문 (base64)
 * - prompt: 제품별 맥락을 포함하는 질문
 */
export type SendMessageParams = {
  question: string;
  streaming?: boolean;
  questionType: 'prompt'; // 지금은 prompt 타입만 지원
  temperature?: number;
};

// Non-streaming response
export interface ChatResponse {
  answer: string;
  status: 'success' | 'error';
}

// Streaming response chunk
export interface ChatStreamResponse {
  status: 'success' | 'error';
  chunk: string;
  done: boolean;
}
