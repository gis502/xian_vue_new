import { riskAreaIcon } from '@/assets';

/**
 * 风险点相关钩子函数
 * @returns 信息框标题、字段映射和获取图标方法
 */
export const useRiskPoint = () => {
  /**
   * 信息框标题
   */
  const informationBoxTitle = '风险区域';

  /**
   * 字段映射配置
   */
  const field = {
    riskName: '风险区名称',
    unitCode: '统一编号',
    housing: '住房（间）',
    permanentPopulation: '常住人口（人）',
    residentCounts: '居民户数（户）',
    riskProperty: '威胁财产（万元）',
    inspectorName: '巡查员姓名',
    inspectorTele: '巡查员手机号',
    position: '位置',
    lon: '经度',
    lat: '纬度',
  };

  /**
   * 获取风险点图标
   * @returns 图标路径
   */
  function getDisasterIcon(): string {
    return riskAreaIcon;
  }

  return { informationBoxTitle, field, getDisasterIcon };
};
