import { bridgeIcon } from '@/assets';

/**
 * 桥梁相关钩子函数
 * @returns
 */
export const useBridgePoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    bridgeName: '桥梁名称',
    bridgeType: '桥梁类型',
    techType: '技术类型',
    lon: '经度',
    lat: '纬度',
  };

  /**
   * 获取桥梁图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return bridgeIcon;
  }

  return { field, getDisasterIcon };
};
