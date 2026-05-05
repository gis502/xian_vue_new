export interface RainfallGridRequest {
  // 时间，默认为当前时间
  time?: string;
  // 分辨率，默认为0.01，最小为0，最大为0.1
  resolution?: number;
}
