import { DEFAULT_MAX_BUFFER_SIZE } from '@/constants/constants';
import { isValidChatStreamResponse } from '@/services/chat/utils';

import type { ChatStreamResponse } from '../services/chat/types';

export interface EventSourcePostInit {
  headers?: Record<string, string>;
  body?: unknown;
  maxBufferSize?: number;
}

/**
 * EventSource 가 GET 메서드만 요청하는 문제로, POST 메서드를 사용하기 위해 구현한 클래스
 */
export class EventSourcePost implements EventSource {
  onerror: ((this: EventSource, ev: Event) => void) | null = null;
  onmessage: ((this: EventSource, ev: MessageEvent) => void) | null = null;
  onopen: ((this: EventSource, ev: Event) => void) | null = null;
  readyState: number = 0;
  url: string;
  withCredentials: boolean = true;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSED = 2;

  private controller: AbortController | null = null;
  private listeners: Map<string, Set<(event: MessageEvent | Event) => void>> = new Map();

  constructor(
    url: string,
    private options: EventSourcePostInit = {
      maxBufferSize: DEFAULT_MAX_BUFFER_SIZE,
    },
  ) {
    this.url = url;
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
          ...this.options.headers,
        },
        body: JSON.stringify(this.options.body),
        credentials: 'include',
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.readyState = this.OPEN;
      this.dispatchEvent(new Event('open'));

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          this.readyState = this.CLOSED;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        if (buffer.length > (this.options.maxBufferSize ?? DEFAULT_MAX_BUFFER_SIZE)) {
          throw new Error('Buffer size exceeds the maximum limit');
        }

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          try {
            const data = JSON.parse(line) as ChatStreamResponse;
            if (!isValidChatStreamResponse(data)) {
              console.warn('Invalid chat stream response:', line);
              continue;
            }
            if (data.done) {
              this.readyState = this.CLOSED;
              return;
            }
            const messageEvent = new MessageEvent('message', { data });
            this.dispatchEvent(messageEvent);
          } catch (error) {
            console.warn('Failed to parse SSE data:', line, error);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        this.readyState = this.CLOSED;
        const errorEvent = new Event('error');
        this.dispatchEvent(errorEvent);
      }
    }
  }

  close(): void {
    if (this.controller) {
      this.controller.abort();
    }
    this.readyState = this.CLOSED;
  }

  addEventListener<K extends keyof EventSourceEventMap>(
    type: K,
    listener: (this: EventSource, ev: EventSourceEventMap[K]) => void,
  ): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as unknown as (event: MessageEvent | Event) => void);
  }

  removeEventListener<K extends keyof EventSourceEventMap>(
    type: K,
    listener: (this: EventSource, ev: EventSourceEventMap[K]) => void,
  ): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener as unknown as (event: MessageEvent | Event) => void);
    }
  }

  /**
   * EventSource 의 이벤트 리스너 등록 방식은
   * addEventListener('open' | 'message' | 'error') 와 onopen, onmessage, onerror 등을 사용하는 2가지 방식을 지원합니다.
   *
   * 이 메서드는 두 방식을 모두 지원하기 위해 구현되었습니다.
   *
   * @param event
   * @returns
   */
  dispatchEvent(event: Event): boolean {
    // Handle built-in event handlers
    if (event.type === 'open' && this.onopen) {
      this.onopen.call(this as EventSource, event);
    } else if (event.type === 'message' && this.onmessage) {
      this.onmessage.call(this as EventSource, event as MessageEvent);
    } else if (event.type === 'error' && this.onerror) {
      this.onerror.call(this as EventSource, event);
    }

    // Handle registered event listeners
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }

    return true;
  }
}
