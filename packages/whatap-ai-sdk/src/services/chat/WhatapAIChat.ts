import { DEFAULT_MAX_BUFFER_SIZE } from '@/constants/constants';
import { EventSourcePost } from '@/libs/EventSourcePost';
import { isChatResponse } from '@/services/chat/utils';
import ky from 'ky';

import { ChatStreamSubscription, ChatStreamSubscriptionImpl } from './WhatapAIChat.Subscription';
import { ChatResponse, SendMessageParams } from './types';

export class WhatapAIChat {
  private readonly endpoint = '/chatbot/api/v1/prompt';
  private readonly maxBufferSize: number;

  constructor({ maxBufferSize }: { maxBufferSize?: number } = {}) {
    this.maxBufferSize = maxBufferSize ?? DEFAULT_MAX_BUFFER_SIZE;
  }

  async sendMessage(params: Omit<SendMessageParams, 'streaming'>): Promise<ChatResponse> {
    const response = await ky.post<ChatResponse>(this.endpoint, {
      json: {
        ...params,
        streaming: false,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!isChatResponse(data)) {
      throw new Error('Invalid response format');
    }
    return data;
  }

  sendMessageStream(params: Omit<SendMessageParams, 'streaming'>): ChatStreamSubscription {
    const eventSource = new EventSourcePost(this.endpoint, {
      body: {
        ...params,
        streaming: true,
      },
      maxBufferSize: this.maxBufferSize,
    });

    return new ChatStreamSubscriptionImpl(eventSource);
  }
}
