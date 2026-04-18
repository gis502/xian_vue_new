import type { Point } from './Point';

/**
 * 西安市政府消防队伍数据接口
 */
export interface XianFirefighter extends Point {
  /** 队伍名称 */
  teamName?: string;
  /** 队伍编号 */
  teamId?: string;
  /** 队伍类型 */
  teamType?: string;
  /** 消防站类型 */
  fireType?: string;
  /** 详细地址 */
  address?: string;
  /** 建立时间 */
  standTime?: string;
  /** 总面积 */
  area?: number;
  /** 建筑面积 */
  structionArea?: number;
  /** 总人数 */
  teamNum?: number;
  /** 指挥人数 */
  leaderNum?: number;
  /** 技术人数 */
  techNum?: number;
  /** 消防员人数 */
  firerNum?: number;
  /** 消防员平均年龄 */
  averageAge?: number;
  /** 消防车总数 */
  cars?: number;
  /** 水罐消防车数 */
  waterCars?: number;
  /** 泡沫消防车数 */
  foamCars?: number;
  /** 举高消防车数 */
  highCars?: number;
  /** 专勤消防车数 */
  dedicateCars?: number;
  /** 器材总数 */
  devices?: number;
  /** 侦检器材数 */
  detectionDevice?: number;
  /** 救援器材数 */
  saveDevice?: number;
  /** 破拆器材数 */
  destructionDevice?: number;
  /** 堵漏器材数 */
  fillDevice?: number;
  /** 转移器材数 */
  transferDevice?: number;
  /** 洗消器材数 */
  washDevice?: number;
  /** 照明器材数 */
  lightDevice?: number;
  /** 灭火器材数 */
  fireDevice?: number;
  /** 上一年出警次数 */
  goOut?: number;
  /** 上一年出警人次 */
  outPeople?: number;
  /** 上一年出警车次 */
  outCar?: number;
  /** 上报时间 */
  reportTime?: string;
  /** 单位负责人 */
  unitHead?: string;
  /** 行政区划代码 */
  governmentCode?: string;
  /** 创建时间 */
  createTime?: string;
  /** 县 */
  county?: string;
  /** 乡 */
  country?: string;
  /** 村 */
  village?: string;
  /** 空间点坐标 */
  position?: string;
  /** 联系电话 */
  telephone?: string;
  /** 创建人名称 */
  createName?: string;
  /** 市 */
  city?: string;
  /** 统计负责人 */
  statisticHead?: string;
  /** 街道 */
  street?: string;
  /** 填表人 */
  fillName?: string;
  /** 省 */
  province?: string;
  /** 物理主键 */
  fxpcDataidSjgl?: string;
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
  /** 经度 */
  lon?: number;
  /** 纬度 */
  lat?: number;
  /** 逻辑删除标识，0未删除，1已删除 */
  isDelete?: number;
}
