import type { Point } from './Point';

/**
 * 西安市学校数据接口
 */
export interface XianSchool extends Point {
  /** 学校名称 */
  schoolName?: string;
  /** 学校地址 */
  schoolAddress?: string;
  /** 学校编码 */
  schoolCode?: string;
  /** 学校类型 */
  schoolType?: string;
  /** 所属部门 */
  schoolCreater?: string;
  /** 学校面积 */
  area?: number;
  /** 建筑物面积 */
  constructionArea?: number;
  /** 设施 */
  devices?: number;
  /** 是否重点保护目标 */
  isImportant?: string;
  /** 工作人员 */
  staff?: number;
  /** 学生数 */
  students?: number;
  /** 留校生 */
  boarder?: number;
  /** 留学生 */
  foreignStudents?: number;
  /** 教室数量 */
  classrooms?: number;
  /** 避难所面积 */
  shelterArea?: number;
  /** 是否有医院 */
  isHaveHospital?: string;
  /** 医生数量 */
  doctorNum?: number;
  /** 安全员数量 */
  securityStaffNum?: number;
  /** 应急电力 */
  emergencyElectric?: string;
  /** 供水 */
  waterMethod?: string;
  /** 供暖 */
  heatingMethod?: string;
  /** 应急通信 */
  emergencyConnectionMethod?: string;
  /** 灾害记录 */
  isDisasterType?: string;
  /** 灾害预案 */
  haveEmergencyPlanType?: string;
  /** 设施编码 */
  institutionCode?: string;
  /** 创造时间 */
  createTime?: string;
  /** 市 */
  city?: string;
  /** 区县 */
  county?: string;
  /** 联系电话 */
  telephone?: string;
  /** 区县编码 */
  code?: string;
  /** 单位负责人 */
  unitHead?: string;
  /** 街道/乡镇 */
  country?: string;
  /** 负责人 */
  fillName?: string;
  /** 承建单位 */
  createName?: string;
  /** 省 */
  province?: string;
  /** 记录人 */
  statisticsHead?: string;
  /** 报告时间 */
  reportTime?: string;
  /** 物理主键 */
  physicalKey?: string;
  /** 省编码 */
  provinceCode?: number;
  /** 市编码 */
  cityCode?: number;
  /** 区县编码 */
  countyCode?: number;
  /** 更新时间 */
  updateTime?: string;
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
