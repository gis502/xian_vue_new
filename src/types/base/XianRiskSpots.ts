import type { Point } from './Point';

export interface XianRiskSpots extends Point {
  /** 风险区名称 */
  riskName?: string;
  /** 统一编号 */
  unitCode?: string;
  /** 风险区等级 */
  riskLevel?: string;
  /** 面积 */
  area?: number;
  /** 省 */
  province?: string;
  /** 市 */
  city?: string;
  /** 县 */
  county?: string;
  /** 乡 */
  country?: string;
  /** 村 */
  village?: string;
  /** 位置 */
  position?: string;
  /** 居民户数（户） */
  residentCounts?: number;
  /** 居民人口（人） */
  addressPopulation?: number;
  /** 威胁财产（万元） */
  riskProperty?: number;
  /** 常住人口（人） */
  permanentPopulation?: number;
  /** 住房（间） */
  housing?: number;
  /** 巡查员姓名 */
  inspectorName?: string;
  /** 巡查员电话 */
  inspectorTele?: string;
  /** 空间 */
  geom?: string;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
