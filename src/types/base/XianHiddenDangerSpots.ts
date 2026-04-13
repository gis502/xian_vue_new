import type { Point } from './Point';

/**
 * 西安市地质灾害隐患点数据接口
 */
export interface XianHiddenDangerSpots extends Point {
  /** 野外编号 */
  fieldCode?: string;
  /** 省名称 */
  province?: string;
  /** 省编号 */
  provinceId?: string;
  /** 市名称 */
  city?: string;
  /** 市编号 */
  cityId?: string;
  /** 县名称 */
  county?: string;
  /** 县编号 */
  countyId?: string;
  /** 乡镇名称 */
  village?: string;
  /** 灾害点名称 */
  disasterName?: string;
  /** 位置描述 */
  position?: string;
  /** 规模等级 */
  scaleGrade?: string;
  /** 险情等级 */
  riskGrade?: string;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: 0 | 1;
}
