import type { Point } from './Point';

/**
 * 西安市水库数据接口
 */
export interface XianReservoirList extends Point {
  /** 水库名称 */
  reservoirName?: string;
  /** 水库位置 */
  location?: string;
  /** 安全评定结果 */
  safetyAssessResult?: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
}
