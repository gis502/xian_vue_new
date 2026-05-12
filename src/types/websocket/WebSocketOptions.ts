/**
 * WebSocket连接配置选项
 */
export interface WebSocketOptions {
  /** WebSocket路径 */
  path?: string;
  /** 是否启用加密（默认true） */
  enableEncrypt?: boolean;
  /** 自动重连间隔（毫秒，默认5000） */
  reconnectInterval?: number;
  /** 最大重连次数（默认10，-1表示无限重连） */
  maxReconnectAttempts?: number;
  /** 心跳间隔（毫秒，默认30000） */
  heartbeatInterval?: number;
  /** 连接超时时间（毫秒，默认10000） */
  connectionTimeout?: number;
}
