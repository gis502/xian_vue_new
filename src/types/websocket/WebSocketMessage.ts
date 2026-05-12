/**
 * WebSocket消息类型
 */
export interface WebSocketMessage {
  type: string;
  data?: unknown;
  encryptedData?: string;
  sm4KeyEncrypted?: string;
  timestamp?: number;
  params?: Record<string, unknown>; // 额外参数
}
