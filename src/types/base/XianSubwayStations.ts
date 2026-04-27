import type { Point } from './Point';

/**
 * 西安市地铁站点数据接口
 */
export interface XianSubwayStations extends Point {
  /** 站点名称 */
  stationName?: string;
  /** 参照积水点 */
  referToTheWaterAccumulationPoint?: string;
  /** 积水深度 */
  depthOfAccumulatedWater?: string;
  /** 核算后积水深度 */
  accumulatedWaterAfterAccounting?: string;
}
