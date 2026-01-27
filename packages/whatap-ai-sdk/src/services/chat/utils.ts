import { ChatResponse, ChatStreamResponse } from '@/services/chat/types';

export function isValidChatStreamResponse(data: any): data is ChatStreamResponse {
  return data !== null && typeof data === 'object' && 'done' in data && 'chunk' in data;
}

export function isChatResponse(data: any): data is ChatResponse {
  return data !== null && typeof data === 'object' && 'status' in data && 'answer' in data;
}
