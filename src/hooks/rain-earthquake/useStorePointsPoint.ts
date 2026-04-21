import { storePointsIcon } from '@/assets';

/**
 * 物资储备点相关钩子函数
 * @returns
 */
export const useStorePointsPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    name: '储备站点名称',
    level: '级别',
    type: '储备站类型',
    address: '地理位置',
    lon: '经度',
    lat: '纬度',
    volume: '储备站有效库容',
    tent: '救援帐篷数',
    generator: '发电机数',
    unitHead: '负责人',
    telephone: '手机号',
  };

  /**
   * 获取物资储备点图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return storePointsIcon;
  }

  return { field, getDisasterIcon };
};
