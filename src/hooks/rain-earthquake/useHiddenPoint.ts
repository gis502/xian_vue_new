import {
  debrisFlowIcon,
  flashFloodIcon,
  landslideIcon,
  waterLoggingIcon,
} from '@/assets';

export const useHiddenPoint = () => {
  const field = {
    fieldCode: '野外编号',
    disasterName: '灾害点名称',
    position: '位置',
    disasterType: '灾害类型',
    scaleGrade: '规模等级',
    riskGrade: '风险等级',
  };

  function getDisasterIcon(disasterType?: string): string {
    switch (disasterType) {
      case '滑坡':
        return landslideIcon;
      case '泥石流':
        return debrisFlowIcon;
      case '内涝':
        return waterLoggingIcon;
      case '山洪':
        return flashFloodIcon;
      default:
        throw new Error(`未知的灾害类型: ${disasterType}`);
    }
  }

  return { field, getDisasterIcon };
};
