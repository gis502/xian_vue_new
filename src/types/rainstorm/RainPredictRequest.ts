/**
 * 降雨预测请求值
 */
export interface RainPredictRequest {
  /** 灾害名称 */
  disaster_name: string;
  /** id列表 */
  point_ids?: number[];
  /** 行政区划代码 */
  region_code?: string;
  /** 累计降雨量 */
  rainfall?: number;
  /** 持续时间 */
  duration?: number;
  /** 发生时间 */
  occurred_time?: string;
  /** 操作类型 */
  operation_type?: string;
}
