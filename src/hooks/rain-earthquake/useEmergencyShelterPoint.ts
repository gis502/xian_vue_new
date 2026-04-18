import { emergencyShelterIcon } from '@/assets';

/**
 * 危险源相关钩子函数
 * @returns
 */
export const useEmergencyShelterPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    name: '避难所名称',
    type: '避难所类型',
    address: '地理位置',
    enterpriseType: '危险源类型',
    lon: '经度',
    lat: '纬度',
    effectiveNumberOfRefugees: '避难所最大容纳人数',
  };

  /**
   * 获取避难所图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return emergencyShelterIcon;
  }

  return { field, getDisasterIcon };
};
