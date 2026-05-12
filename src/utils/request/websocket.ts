import type { WebSocketOptions } from '@/types/websocket/WebSocketOptions';
import { SafetyUtils } from '../safety/SafetyUtils';
import type { WebSocketMessage } from '@/types/websocket/WebSocketMessage';

/**
 * WebSocket事件回调类型
 */
export type WebSocketEventCallback = (data: unknown) => void;

/**
 * WebSocket管理器
 * 提供WebSocket连接的统一管理
 */
export class WebSocketManager {
  #ws: WebSocket | null = null;
  #url: string = '';
  #options: Required<WebSocketOptions>;
  #eventCallbacks: Map<string, Set<WebSocketEventCallback>> = new Map();
  #reconnectAttempts: number = 0;
  #heartbeatTimer: number | null = null;
  #reconnectTimer: number | null = null;
  #isManualClose: boolean = false;
  #sessionSm4Key: string | null = null;
  #connectionTimeoutTimer: number | null = null;

  constructor(options: WebSocketOptions = {}) {
    this.#options = {
      path: options.path || '/websocket',
      enableEncrypt: options.enableEncrypt ?? true,
      reconnectInterval: options.reconnectInterval ?? 5000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      heartbeatInterval: options.heartbeatInterval ?? 30000,
      connectionTimeout: options.connectionTimeout ?? 10000,
    };

    // 构建WebSocket URL
    const wsBaseUrl =
      import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8081';
    this.#url = `${wsBaseUrl}${this.#options.path}`;
  }

  /**
   * 连接WebSocket
   * @returns Promise<void>
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.#isManualClose = false;
      this.#ws = new WebSocket(this.#url);

      // 设置连接超时
      this.#connectionTimeoutTimer = window.setTimeout(() => {
        if (this.#ws?.readyState !== WebSocket.OPEN) {
          this.#ws?.close();
          reject(new Error('WebSocket连接超时'));
        }
      }, this.#options.connectionTimeout);

      // 连接成功
      this.#ws.onopen = async () => {
        this.#reconnectAttempts = 0;

        // 清除连接超时定时器
        if (this.#connectionTimeoutTimer) {
          clearTimeout(this.#connectionTimeoutTimer);
          this.#connectionTimeoutTimer = null;
        }

        // 如果启用加密，建立会话密钥
        if (this.#options.enableEncrypt) {
          try {
            // 生成会话SM4密钥
            this.#sessionSm4Key = SafetyUtils.generateSm4Key();
            // 使用SM2公钥加密会话密钥并发送给后端
            const encryptedSessionKey = await SafetyUtils.sm2Encrypt(
              this.#sessionSm4Key
            );

            // 发送会话密钥给后端（使用特殊的消息类型）
            this.#ws?.send(
              JSON.stringify({
                type: 'session-key',
                sm4KeyEncrypted: encryptedSessionKey,
                timestamp: Date.now(),
              })
            );
          } catch (error) {
            console.error('会话密钥建立失败:', error);
          }
        }

        // 启动心跳
        this.#startHeartbeat();

        resolve();
      };

      // 接收消息
      this.#ws.onmessage = async (event) => {
        try {
          let message: WebSocketMessage;

          if (typeof event.data === 'string') {
            message = JSON.parse(event.data);
          } else {
            message = event.data;
          }

          // 解密处理
          if (
            this.#options.enableEncrypt &&
            message.encryptedData &&
            this.#sessionSm4Key
          ) {
            try {
              // 使用会话SM4密钥解密数据
              const decryptedPayload = SafetyUtils.sm4Decrypt(
                this.#sessionSm4Key,
                message.encryptedData
              );

              // 解析解密后的payload
              if (
                typeof decryptedPayload === 'object' &&
                decryptedPayload !== null
              ) {
                const payload = decryptedPayload as {
                  data?: unknown;
                  params?: Record<string, unknown>;
                };
                message.data = payload.data;
                message.params = payload.params;
              } else {
                message.data = decryptedPayload;
              }
            } catch (error) {
              console.error('WebSocket消息解密失败:', error);
            }
          }

          // 触发对应类型的回调
          const callbacks = this.#eventCallbacks.get(message.type);
          if (callbacks) {
            callbacks.forEach((callback) => callback(message.data));
          }

          // 触发通用消息回调
          const allCallbacks = this.#eventCallbacks.get('*');
          if (allCallbacks) {
            allCallbacks.forEach((callback) => callback(message));
          }
        } catch (error) {
          console.error('WebSocket消息处理失败:', error);
        }
      };

      // 连接关闭
      this.#ws.onclose = (event) => {
        console.log('WebSocket连接关闭:', event.code, event.reason);
        this.#stopHeartbeat();
        this.#clearConnectionTimeout();

        // 如果不是手动关闭且未达到最大重连次数，则尝试重连
        if (!this.#isManualClose) {
          this.#attemptReconnect();
        }
      };

      // 连接错误
      this.#ws.onerror = (error) => {
        console.error('WebSocket连接错误:', error);
        this.#clearConnectionTimeout();
        reject(error);
      };
    });
  }

  /**
   * 发送消息
   * @param type - 消息类型
   * @param data - 消息数据
   * @param params - 额外参数（可选）
   */
  async send(
    type: string,
    data?: unknown,
    params?: Record<string, unknown>
  ): Promise<void> {
    if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket未连接');
    }

    let message: WebSocketMessage = {
      type,
      data,
      params,
      timestamp: Date.now(),
    };

    // 加密处理
    if (this.#options.enableEncrypt) {
      try {
        // 生成SM4密钥
        const sm4Key = SafetyUtils.generateSm4Key();

        // 使用SM2公钥加密SM4密钥
        const sm4KeyEncrypted = await SafetyUtils.sm2Encrypt(sm4Key);

        // 组合数据和参数进行加密
        const payload = {
          data,
          params,
        };

        // 使用SM4加密整个payload
        const encryptedData = SafetyUtils.sm4Encrypt(sm4Key, payload);

        message = {
          type,
          encryptedData,
          sm4KeyEncrypted,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error('WebSocket消息加密失败:', error);
        throw new Error('消息加密失败');
      }
    }

    this.#ws.send(JSON.stringify(message));
  }

  /**
   * 注册事件监听器
   * @param type - 消息类型（'*'表示监听所有消息）
   * @param callback - 回调函数
   * @returns 取消订阅函数
   */
  on(type: string, callback: WebSocketEventCallback): () => void {
    if (!this.#eventCallbacks.has(type)) {
      this.#eventCallbacks.set(type, new Set());
    }
    this.#eventCallbacks.get(type)!.add(callback);

    // 返回取消订阅函数
    return () => {
      this.off(type, callback);
    };
  }

  /**
   * 移除事件监听器
   * @param type - 消息类型
   * @param callback - 回调函数
   */
  off(type: string, callback: WebSocketEventCallback): void {
    const callbacks = this.#eventCallbacks.get(type);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.#eventCallbacks.delete(type);
      }
    }
  }

  /**
   * 关闭WebSocket连接
   */
  close(): void {
    this.#isManualClose = true;
    this.#stopHeartbeat();
    this.#clearReconnectTimer();
    this.#clearConnectionTimeout();
    this.#sessionSm4Key = null; // 清除会话密钥

    if (this.#ws) {
      this.#ws.close();
      this.#ws = null;
    }

    console.log('WebSocket连接已手动关闭');
  }

  /**
   * 获取连接状态
   * @returns WebSocket就绪状态
   */
  get readyState(): number {
    return this.#ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * 是否已连接
   * @returns 是否已连接
   */
  get isConnected(): boolean {
    return this.#ws?.readyState === WebSocket.OPEN;
  }

  // ===================== 私有方法 =====================

  /**
   * 尝试重连
   */
  #attemptReconnect(): void {
    const { maxReconnectAttempts, reconnectInterval } = this.#options;

    // 检查是否达到最大重连次数
    if (
      maxReconnectAttempts !== -1 &&
      this.#reconnectAttempts >= maxReconnectAttempts
    ) {
      console.error(
        `WebSocket重连失败：已达到最大重连次数(${maxReconnectAttempts})`
      );
      return;
    }

    this.#reconnectAttempts++;
    console.log(
      `WebSocket将在${reconnectInterval}ms后尝试第${this.#reconnectAttempts}次重连...`
    );

    this.#reconnectTimer = window.setTimeout(() => {
      this.connect().catch((error) => {
        console.error('WebSocket重连失败:', error);
      });
    }, reconnectInterval);
  }

  /**
   * 启动心跳
   */
  #startHeartbeat(): void {
    this.#stopHeartbeat();

    this.#heartbeatTimer = window.setInterval(() => {
      if (this.isConnected) {
        this.send('ping').catch((error) => {
          console.error('心跳发送失败:', error);
        });
      }
    }, this.#options.heartbeatInterval);
  }

  /**
   * 停止心跳
   */
  #stopHeartbeat(): void {
    if (this.#heartbeatTimer) {
      clearInterval(this.#heartbeatTimer);
      this.#heartbeatTimer = null;
    }
  }

  /**
   * 清除重连定时器
   */
  #clearReconnectTimer(): void {
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
  }

  /**
   * 清除连接超时定时器
   */
  #clearConnectionTimeout(): void {
    if (this.#connectionTimeoutTimer) {
      clearTimeout(this.#connectionTimeoutTimer);
      this.#connectionTimeoutTimer = null;
    }
  }
}

/**
 * 创建WebSocket管理器实例的工厂函数
 * @param options - WebSocket配置选项
 * @returns WebSocket管理器实例
 */
export function createWebSocket(options?: WebSocketOptions): WebSocketManager {
  return new WebSocketManager(options);
}

// 导出默认实例
export const defaultWebSocket = createWebSocket();
