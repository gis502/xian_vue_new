import { hospitalIcon } from '@/assets';

/**
 * 医院相关钩子函数
 * @returns
 */
export const useHospitalPoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    name: '医院名称',
    level: '级别',
    address: '地理位置',
    lon: '经度',
    lat: '纬度',
    sumPeople: '年度诊疗人数',
    unitHead: '负责人',
    telephone: '手机号',
  };

  /**
   * 获取医院图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return hospitalIcon;
  }

  return { field, getDisasterIcon };
};
