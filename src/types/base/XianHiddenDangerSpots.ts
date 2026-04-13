import type { Point } from './Point';

/**
 * 地质灾害隐患点
 */
export interface XianHiddenDangerSpots extends Point {
  /** 野外编号 */
  fieldCode?: string;
  /** 省 */
  province?: string;
  /** 省编号 */
  provinceId?: string;
  /** 市 */
  city?: string;
  /** 市编号 */
  cityId?: string;
  /** 县 */
  county?: string;
  /** 县编号 */
  countyId?: string;
  /** 乡镇 */
  village?: string;
  /** 灾害点名称 */
  disasterName?: string;
  /** 位置 */
  position?: string;
  /** 规模等级 */
  scaleGrade?: string;
  /** 险情等级 */
  riskGrade?: string;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: 0 | 1;
}
