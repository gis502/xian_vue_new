import { subwayIcon } from '@/assets';

/**
 * 地铁站点相关钩子函数
 * @returns 字段映射和获取图标方法
 */
export const useSubwayStationPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    stationName: '站点名称',
    referToTheWaterAccumulationPoint: '参照积水点',
    depthOfAccumulatedWater: '积水深度',
    accumulatedWaterAfterAccounting: '核算后积水深度',
    lon: '经度',
    lat: '纬度',
  };

  /**
   * 获取地铁站点图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return subwayIcon;
  }

  return { field, getDisasterIcon };
};
