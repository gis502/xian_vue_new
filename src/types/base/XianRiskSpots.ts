import type { Point } from './Point';

/**
 * 西安市风险点数据接口
 */
export interface XianRiskSpots extends Point {
  /** 风险区名称 */
  riskName?: string;
  /** 统一编号 */
  unitCode?: string;
  /** 风险区等级 */
  riskLevel?: string;
  /** 面积（平方公里） */
  area?: number;
  /** 省名称 */
  province?: string;
  /** 市名称 */
  city?: string;
  /** 县名称 */
  county?: string;
  /** 乡名称 */
  country?: string;
  /** 村名称 */
  village?: string;
  /** 位置描述 */
  position?: string;
  /** 居民户数（户） */
  residentCounts?: number;
  /** 居民人口（人） */
  addressPopulation?: number;
  /** 威胁财产（万元） */
  riskProperty?: number;
  /** 常住人口（人） */
  permanentPopulation?: number;
  /** 住房数量（间） */
  housing?: number;
  /** 巡查员姓名 */
  inspectorName?: string;
  /** 巡查员电话 */
  inspectorTele?: string;
  /** 空间几何数据 */
  geom?: string;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
