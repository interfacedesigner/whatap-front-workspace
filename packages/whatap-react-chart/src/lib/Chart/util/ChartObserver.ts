export default class ChartObserver {
  private static instance: ChartObserver;
  globalStore: any;
  eventHandlers: any;
  connections: any;

  constructor() {
    this.globalStore = {
      theme: {},
    };
    this.connections = [];
    this.eventHandlers = {};
  }

  public static getInstance(): ChartObserver {
    if (!ChartObserver.instance) {
      ChartObserver.instance = new ChartObserver();
    }

    return ChartObserver.instance;
  }

  connect = (callback: Function) => {
    // 스토어의 내용 변화를 감지하도록 등록
    return {
      idx: this.connections.push(callback) - 1,
      store: { ...this.globalStore },
    };
  };

  disconnect = (idx: number) => {
    // 스토어와 연결 해제
    this.connections.splice(idx);
  };

  dispatch = (obj: any) => {
    // 스토어에 내용 등록
    if (typeof obj !== 'object') {
      return;
    }
    let update = false;

    Object.keys(obj).map((key: string) => {
      if (typeof obj[key] !== undefined && this.globalStore[key] !== obj[key]) {
        this.globalStore[key] = obj[key];
        update = true;
      }
    });

    if (update) {
      this.connections.map((callBack: Function) => {
        callBack({ ...this.globalStore });
      });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////

  subscribe = (eventName: string, callBack: Function, context: any) => {
    // 이벤트 단위로 구독
    let eventNamespace = this.eventHandlers[eventName];

    if (typeof eventNamespace === 'undefined') {
      eventNamespace = this.eventHandlers[eventName] = [];
    }

    eventNamespace.push({ handler: callBack, context: context });
  };

  unsubscribe = (eventName: string, context: any) => {
    const eventNamespace = this.eventHandlers[eventName];

    const length = eventNamespace.length;

    for (let i = 0; i < length; i++) {
      const obj = eventNamespace[i];
      if (obj.context === context) {
        if (length === 1) {
          delete this.eventHandlers[eventName];
        } else {
          eventNamespace.splice(i, 1);
        }
        break;
      }
    }
  };

  unsubscribeAll = (context: any) => {
    Object.keys(this.eventHandlers).map((eventName) => {
      this.unsubscribe(eventName, context);
    });
  };

  publish = (eventName: string, data: any, deleteContext: any) => {
    const subscribers = this.eventHandlers[eventName];
    if (subscribers) {
      subscribers.map((subscriber: any) => {
        if (subscriber.context !== deleteContext) {
          subscriber.handler(data, deleteContext);
        }
      });
    }
  };
}
