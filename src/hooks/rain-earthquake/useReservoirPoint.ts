import { reservoirIcon } from '@/assets';

/**
 * 水库相关钩子函数
 * @returns 字段映射和获取图标方法
 */
export const useReservoirPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    reservoirName: '水库名称',
    location: '地理位置',
    safetyAssessResult: '安全等级',
    lon: '经度',
    lat: '纬度',
  };

  /**
   * 获取水库图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return reservoirIcon;
  }

  return { field, getDisasterIcon };
};
