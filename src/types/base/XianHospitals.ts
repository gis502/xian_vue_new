import type { Point } from './Point';

/**
 * 西安市医院医疗机构数据接口
 */
export interface XianHospitals extends Point {
  /** 医院名称 */
  name?: string;
  /** 详细地址 */
  address?: string;
  /** 医疗卫生机构类别代码 */
  typeCode?: string;
  /** 医疗机构类型（大类） */
  type?: string;
  /** 医疗机构类型（中类） */
  middleType?: string;
  /** 医疗机构类型（专业） */
  perferssionType?: string;
  /** 医院等级 */
  level?: string;
  /** 医疗机构性质 */
  institutionNature?: string;
  /** 总面积 */
  area?: number;
  /** 建筑面积 */
  structionArea?: number;
  /** 万元以上设备数 */
  devices?: number;
  /** 总职工数 */
  workers?: number;
  /** 卫生技术人员数 */
  techWorker?: number;
  /** 护士数 */
  nurse?: number;
  /** 工勤人数 */
  dedicateWorker?: number;
  /** 年度总诊疗人数 */
  sumPeople?: number;
  /** 年度入院人数 */
  inPeople?: number;
  /** 年度出院人数 */
  outPeople?: number;
  /** 总床位 */
  beds?: number;
  /** 负压病床 */
  negativeBeds?: number;
  /** ICU病床 */
  icuBeds?: number;
  /** 院前急救专业人员数 */
  savePeople?: number;
  /** 指挥车数 */
  controllerCar?: number;
  /** 转运车数 */
  transferCars?: number;
  /** 监护车数 */
  inspectorCars?: number;
  /** 负压车数 */
  negativeCars?: number;
  /** 采血车数 */
  bloodCars?: number;
  /** 送血车数 */
  sendBloodCars?: number;
  /** 安保人员数 */
  safePeople?: number;
  /** 应急供电能力 */
  emergencyPower?: string;
  /** 供水方式 */
  waterSupply?: string;
  /** 供暖方式 */
  heating?: string;
  /** 应急通信保障方式 */
  connectionType?: string;
  /** 曾遭受的自然灾害类型 */
  hadDisasterType?: string;
  /** 已有自然灾害应急预案类型 */
  emergencyPlan?: string;
  /** 行政区划代码 */
  governmentCode?: string;
  /** 村 */
  village?: string;
  /** 市 */
  city?: string;
  /** 创建人名称 */
  createName?: string;
  /** 单位负责人 */
  unitHead?: string;
  /** 空间点 */
  position?: string;
  /** 统计负责人 */
  statisticsHead?: string;
  /** 联系电话 */
  telephone?: string;
  /** 省 */
  province?: string;
  /** 创建时间 */
  createTime?: string;
  /** 上报时间 */
  reportTime?: string;
  /** 县 */
  county?: string;
  /** 乡 */
  country?: string;
  /** 街 */
  street?: string;
  /** 填表人 */
  fillName?: string;
  /** 代码类型(统一社会信用代码/机构编码) */
  institutionCodeType?: string;
  /** 统一社会信用代码/机构编码 */
  institutionCode?: string;
  /** 物理主键 */
  physicalKey?: string;
  /** 省编码 */
  provinceCode?: number;
  /** 市编码 */
  cityCode?: number;
  /** 县编码 */
  countyCode?: number;
  /** 更新时间 */
  updateTime?: string;
  /** 写入时间 */
  writeTime?: string;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
