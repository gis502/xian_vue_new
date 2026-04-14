import { debrisFlowIcon, landslideIcon, riskAreaIcon } from '@/assets';

/**
 * 暴雨图例钩子函数
 * @returns 图例数据列表
 */
export const useEarthquakeLegend = () => {
  /**
   * 图例数据
   */
  const legendList = [
    { name: '滑坡隐患点', link: landslideIcon },
    { name: '泥石流隐患点', link: debrisFlowIcon },
    { name: '风险区域', link: riskAreaIcon },
  ];

  return { legendList };
};
