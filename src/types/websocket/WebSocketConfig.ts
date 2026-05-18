/**
 * WebSocket连接配置选项
 */
export interface WebSocketConfig {
  /** WebSocket路径 */
  url: string;
  /** 自动重连间隔（毫秒，默认3000） */
  reconnectDelay?: number;
  /** 最大重连次数（默认5，-1表示无限重连） */
  maxReconnectAttempts?: number;
  /** 心跳间隔（毫秒，默认50000） */
  heartbeatIncoming?: number;
  /** 连接超时时间（毫秒，默认30000） */
  heartbeatOutgoing?: number;
}
