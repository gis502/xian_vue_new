export interface RainfallGridRequest {
  // 开始时间，默认为当前时间
  startTime?: string;
  // 结束时间，默认为当前时间
  endTime?: string;
  // 区域id，默认为1
  districtId?: number;
  // 分辨率，默认为0.01，最小为0，最大为1
  resolution?: number;
}
