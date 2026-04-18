import { firefighterIcon } from '@/assets';

/**
 * 消防站相关钩子函数
 * @returns
 */
export const useFireStationPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    teamName: '消防站/队名称',
    teamType: '消防站类型',
    address: '地理位置',
    lon: '经度',
    lat: '纬度',
    teamNum: '消防队人数',
    cars: '消防车数量',
    devices: '消防器材数量',
    unitHead: '负责人',
    telephone: '手机号',
  };

  /**
   * 获取消防站图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return firefighterIcon;
  }

  return { field, getDisasterIcon };
};
