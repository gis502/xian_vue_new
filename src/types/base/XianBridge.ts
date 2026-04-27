import type { Point } from './Point';

/**
 * 西安市桥梁数据接口
 */
export interface XianBridge extends Point {

  /**
   * 区域
   */
  region?: string;

  /**
   * 名称
   */
  bridgeName?: string;

  /**
   * 位置
   */
  location?: string;

  /**
   * 建成时间
   */
  buildTime?: string;

  /**
   * 类型
   */
  bridgeType?: string;

  /**
   * 养护类型
   */
  maintainType?: string;

  /**
   * 技术类型
   */
  techType?: string;

  /**
   * 规模
   */
  scale?: string;

  /**
   * 面积
   */
  area?: number;

  /**
   * 所属单位
   */
  master?: string;

  /**
   * 养护单位
   */
  maint?: string;

  /**
   * 备注
   */
  note?: string;

  /**
   * 位置 (可能是 GeoJSON 对象或其他结构)
   */
  point?: unknown;

  /**
   * 逻辑删除标识，0未删除，1已删除
   */
  isDelete?: number;
}
