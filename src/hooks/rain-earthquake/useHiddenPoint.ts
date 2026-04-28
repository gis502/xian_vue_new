import {
  debrisFlowIcon,
  flashFloodIcon,
  landslideIcon,
  waterLoggingIcon,
} from '@/assets';

/**
 * 隐患点相关钩子函数
 * @returns 字段映射和获取灾害图标方法
 */
export const useHiddenPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    fieldCode: '野外编号',
    disasterName: '灾害点名称',
    position: '位置',
    disasterType: '灾害类型',
    scaleGrade: '规模等级',
    riskGrade: '风险等级',
  };

  /**
   * 根据灾害类型获取对应图标
   * @param disasterType - 灾害类型（支持中英文）
   * @returns 图标路径
   */
  function getDisasterIcon(disasterType?: string): string {
    // 支持英文和中文两种格式
    switch (disasterType) {
      case 'landslide':
      case '滑坡':
        return landslideIcon;
      case 'debris_flow':
      case '泥石流':
        return debrisFlowIcon;
      case 'water_logging':
      case '内涝':
        return waterLoggingIcon;
      case 'flash_flood':
      case '山洪':
        return flashFloodIcon;
      default:
        throw new Error(`未知的灾害类型: ${disasterType}`);
    }
  }

  return { field, getDisasterIcon };
};
