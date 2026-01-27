import { DEFAULT_MAX_BUFFER_SIZE } from '@/constants/constants';
import WhatapAIChat from '@/services/chat';

export class WhatapAISDK {
  public readonly chat: WhatapAIChat;

  constructor({
    maxBufferSize = DEFAULT_MAX_BUFFER_SIZE,
  }: {
    maxBufferSize?: number;
  } = {}) {
    this.chat = new WhatapAIChat({ maxBufferSize });
  }
}
