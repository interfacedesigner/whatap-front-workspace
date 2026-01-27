import { ChatStreamResponse } from './types';
import { isValidChatStreamResponse } from './utils';

export interface ChatStreamSubscription {
  subscribe(callback: (response: ChatStreamResponse) => void): ChatStreamSubscription;
  onError(callback: (error: Error) => void): ChatStreamSubscription;
  onClose(callback: () => void): ChatStreamSubscription;
  close(): void;
  isConnected(): boolean;
}

export class ChatStreamSubscriptionImpl implements ChatStreamSubscription {
  private eventSource: EventSource;
  private callbacks = new Set<(response: ChatStreamResponse) => void>();
  private errorCallbacks = new Set<(error: Error) => void>();
  private closeCallbacks = new Set<() => void>();

  constructor(eventSource: EventSource) {
    this.eventSource = eventSource;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        if (!isValidChatStreamResponse(data)) {
          throw new Error('Invalid stream response format');
        }
        this.callbacks.forEach((callback) => callback(data));
      } catch (error) {
        const parseError =
          error instanceof Error
            ? new Error(`Failed to parse stream response: ${error.message}`)
            : new Error('Failed to parse stream response');
        this.errorCallbacks.forEach((callback) => callback(parseError));
      }
    };

    this.eventSource.onerror = () => {
      this.errorCallbacks.forEach((callback) => callback(new Error('Stream connection error')));
    };
  }

  subscribe(callback: (response: ChatStreamResponse) => void): ChatStreamSubscription {
    this.callbacks.add(callback);
    return this;
  }

  onError(callback: (error: Error) => void): ChatStreamSubscription {
    this.errorCallbacks.add(callback);
    return this;
  }

  onClose(callback: () => void): ChatStreamSubscription {
    this.closeCallbacks.add(callback);
    return this;
  }

  close(): void {
    this.eventSource.close();
    this.closeCallbacks.forEach((callback) => callback());
  }

  isConnected(): boolean {
    return this.eventSource.readyState === this.eventSource.OPEN;
  }
}
