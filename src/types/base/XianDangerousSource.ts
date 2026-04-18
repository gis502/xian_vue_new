import type { Point } from './Point';

/**
 * 西安市危险源数据接口
 */
export interface XianDangerousSource extends Point {
  /** 企业名称 */
  name?: string;
  /** 全国统一社会信用代码 */
  unitCode?: string;
  /** 详细地址 */
  address?: string;
  /** 是否位于化工园区 */
  isInchemistry?: string;
  /** 开业（成立）时间 */
  standTime?: string;
  /** 企业类型 */
  enterpriseType?: string;
  /** 等级 */
  level?: string;
  /** 安全生产标准化等级 */
  safeProductLevel?: string;
  /** 总容积 */
  sumVolume?: string;
  /** 储罐类型 */
  tankType?: string;
  /** 总容积（其他说明1） */
  sumVolumeOther1?: string;
  /** 总容积（其他说明3） */
  sumVolumeOther3?: string;
  /** 总容积（其他说明2） */
  sumVolumeOther2?: string;
  /** 创建时间 */
  createTime?: string;
  /** 填表人 */
  fillName?: string;
  /** 空间点坐标 */
  position?: string;
  /** 省 */
  province?: string;
  /** 市 */
  city?: string;
  /** 上报时间 */
  reportTime?: string;
  /** 联系电话 */
  telephone?: string;
  /** 县 */
  county?: string;
  /** 乡 */
  country?: string;
  /** 单位负责人 */
  unitHead?: string;
  /** 创建人名称 */
  createName?: string;
  /** 村 */
  village?: string;
  /** 行政区划代码 */
  governmentCode?: string;
  /** 街道 */
  street?: string;
  /** 统计负责人 */
  statisticsHead?: string;
  /** 机构编码 */
  structionCode?: string;
  /** 物理主键 */
  physicalKey?: string;
  /** 省编码 */
  provinceCode?: string;
  /** 市编码 */
  cityCode?: string;
  /** 县编码 */
  countyCode?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 写入时间 */
  writeTime?: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
