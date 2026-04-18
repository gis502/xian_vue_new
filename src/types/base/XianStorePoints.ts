import type { Point } from './Point';

/**
 * 西安市物资储备点数据接口
 */
export interface XianStorePoints extends Point {
  /** 储备库名称 */
  name?: string;
  /** 详细地址 */
  address?: string;
  /** 所属部门 */
  department?: string;
  /** 分级 */
  level?: string;
  /** 类型 */
  type?: string;
  /** 建立时间 */
  standTime?: string;
  /** 有效库容 */
  volume?: string;
  /** 维护人员 */
  maintenance?: string;
  /** 救灾帐篷 */
  tent?: number;
  /** 棉被 */
  quilt?: number;
  /** 棉衣 */
  clothes?: number;
  /** 毛巾被 */
  towelBlanket?: number;
  /** 毛毯 */
  blanket?: number;
  /** 睡袋 */
  sleepingBed?: number;
  /** 折叠床 */
  foldingBed?: number;
  /** 简易厕所 */
  wc?: number;
  /** 生活类物资折合金额 */
  shlwzzhje?: number;
  /** 橡皮船 */
  rubberBoat?: number;
  /** 冲锋舟 */
  rescueBoat?: number;
  /** 救生船 */
  saveBoat?: number;
  /** 救生衣 */
  saveClothes?: number;
  /** 救生圈 */
  jsq?: number;
  /** 编织袋 */
  bzd?: number;
  /** 麻袋 */
  md?: number;
  /** 抽水泵 */
  waterPump?: number;
  /** 救援类物资折和金额 */
  jylwzzhje?: number;
  /** 发电机 */
  generator?: number;
  /** 应急灯 */
  emergencyLight?: number;
  /** 其他物资折合金额 */
  qtwzzhje?: number;
  /** 救灾衣被 */
  saveClo?: number;
  /** 救援工具 */
  saveTool?: number;
  /** 折合金额 */
  zhje?: string;
  /** 市 */
  city?: string;
  /** 省 */
  province?: string;
  /** 村 */
  village?: string;
  /** 上报日期 */
  reportTime?: string;
  /** 乡 */
  country?: string;
  /** 创建人名称 */
  creatName?: string;
  /** 县 */
  county?: string;
  /** 单位负责人 */
  unitHead?: string;
  /** 填表人 */
  fillName?: string;
  /** 联系电话 */
  telephone?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 写入时间 */
  overwriteTime?: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
