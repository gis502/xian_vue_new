import {
  debrisFlowIcon,
  flashFloodIcon,
  landslideIcon,
  riskAreaIcon,
  waterLoggingIcon,
} from '@/assets';

// 引入图例钩子函数
export function useRainLegend() {
  // 图例数据
  const legendList = [
    { name: '滑坡隐患点', link: landslideIcon },
    { name: '泥石流隐患点', link: debrisFlowIcon },
    { name: '山洪隐患点', link: flashFloodIcon },
    { name: '内涝隐患点', link: waterLoggingIcon },
    { name: '风险区域', link: riskAreaIcon },
  ];

  return { legendList };
}
