import type { Point } from './Point';

/**
 * 西安市应急避难所数据接口
 */
export interface XianEmergencyShelter extends Point {
  /** 避难所时间 */
  year?: string;
  /** 避难所区县 */
  district?: string;
  /** 避难所名字 */
  name?: string;
  /** 避难所地址 */
  address?: string;
  /** 避难所类型 */
  type?: string;
  /** 避难所性质 */
  constructionCategory?: string;
  /** 占地面积 */
  coverArea?: string;
  /** 有效占地面积 */
  effectiveRefugeArea?: string;
  /** 有效容纳人数 */
  effectiveNumberOfRefugees?: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
