/**
 * 灾害类型枚举
 */
export enum DisasterType {
  /** 暴雨 */
  RAINSTORM = 'rainstorm',
  /** 地震 */
  EARTHQUAKE = 'earthquake',
}

/**
 * 点型枚举（用于UI显示）
 */
export enum PointType {
  /** 滑坡 */
  LANDSLIDE = '滑坡',
  /** 泥石流 */
  DEBRIS_FLOW = '泥石流',
  /** 内涝 */
  WATER_LOGGING = '内涝',
  /** 山洪 */
  FLASH_FLOOD = '山洪',
  /** 风险区 */
  RISK_AREA = '风险区',
}

/**
 * 隐患点类型映射（中文 -> 后端英文参数）
 */
export const HiddenDangerPointTypeMap: Record<PointType, string> = {
  [PointType.LANDSLIDE]: 'landslide',
  [PointType.DEBRIS_FLOW]: 'debris_flow',
  [PointType.WATER_LOGGING]: 'water_logging',
  [PointType.FLASH_FLOOD]: 'flash_flood',
  [PointType.RISK_AREA]: 'risk_area',
};
