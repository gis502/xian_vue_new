import type { WebSocketConfig } from '@/types/websocket/WebSocketConfig';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WebSocketService {
  private stompClient: Client | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private config: Required<WebSocketConfig>;

  // 存储各个主题的回调列表
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map();

  // 连接状态回调
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: unknown) => void;

  constructor(config?: WebSocketConfig) {
    config = config || ({} as WebSocketConfig);
    this.config = {
      url: config!.url || import.meta.env.VITE_WEBSOCKET_URL,
      reconnectDelay: config!.reconnectDelay || 3000,
      maxReconnectAttempts: config!.maxReconnectAttempts || 5,
      heartbeatIncoming: config!.heartbeatIncoming || 30000,
      heartbeatOutgoing: config!.heartbeatOutgoing || 30000,
    };
  }

  /**
   * 连接 WebSocket
   */
  connect() {
    if (this.connected) {
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.config.url),
      reconnectDelay: this.config.reconnectDelay,
      heartbeatIncoming: this.config.heartbeatIncoming,
      heartbeatOutgoing: this.config.heartbeatOutgoing,
    });

    // 连接成功回调
    this.stompClient.onConnect = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.onConnected?.();
    };

    // 断开连接回调
    this.stompClient.onDisconnect = () => {
      this.connected = false;
      this.onDisconnected?.();
    };

    // 错误回调
    this.stompClient.onStompError = (frame) => {
      console.error('STOMP 错误:', frame.headers['message']);
      console.error('详细错误:', frame.body);
      this.onError?.(frame);
    };

    try {
      this.stompClient.activate();
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.handleError(error);
    }
  }

  /**
   * 订阅某个主题，并注册回调
   */
  subscribe<T = unknown>(topic: string, callback: (data: T) => void) {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket 未连接');
      return;
    }

    // 如果还没有该主题的订阅者集合，则创建一个新的
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }

    // 添加当前回调到订阅者集合
    this.subscribers.get(topic)!.add(callback as (data: unknown) => void);

    // 实际订阅 STOMP 主题
    this.stompClient.subscribe(topic, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        // 调用所有注册在该主题上的回调
        this.subscribers.get(topic)?.forEach((cb) => cb(data));
      } catch (error) {
        console.error(`解析消息失败 [${topic}]:`, error);
        this.onError?.(error);
      }
    });
  }

  /**
   * 发送消息到指定目的地
   */
  send(destination: string, body?: unknown) {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket 未连接');
      return;
    }

    this.stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
      this.subscribers.clear();
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * 处理错误并重连
   */
  private handleError(error: unknown) {
    this.reconnectAttempts++;
    console.error(
      `连接失败 (尝试 ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}):`,
      error
    );

    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      setTimeout(() => {
        this.connect();
      }, this.config.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('达到最大重连次数，请检查网络连接');
      this.onError?.(error);
    }
  }
}

export const socketSignalInstance = new WebSocketService();
