/**
 * 点类数据接口，与点相关数据需要继承该接口
 */
export interface Point {
  /** 序号 */
  id?: number;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 空间几何数据 */
  geom?: string;
  /** 灾害类型 */
  disasterType?: string;
  /** 名称 */
  name?: string;
}
