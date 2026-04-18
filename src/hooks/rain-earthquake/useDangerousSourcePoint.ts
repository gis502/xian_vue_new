import { dangerousSourceIcon } from '@/assets';

/**
 * 危险源相关钩子函数
 * @returns
 */
export const useDangerousSourcePoint = () => {
  /**
   * 字段映射配置
   */
  const field = {
    unitCode: '统一编号',
    name: '危险源名称',
    level: '级别',
    enterpriseType: '危险源类型',
    address: '地理位置',
    lon: '经度',
    lat: '纬度',
    unitHead: '负责人',
    telephone: '手机号',
  };

  /**
   * 获取危险源图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return dangerousSourceIcon;
  }

  return { field, getDisasterIcon };
};
