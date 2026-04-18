import { useStatusStore } from '@/stores/useStatusStore';

/**
 * 控制面板显示隐藏逻辑
 */
export const useLayerControl = () => {
  /**
   * 点击显示隐藏隐患点
   * @param status - 显示隐藏状态
   */
  const clickHiddenDangerPoint = (status: unknown) => {
    // 改变风险点显示状态
    useStatusStore().mapLayers.riskPointShow.show = status as boolean;
  };

  /**
   * 点击显示医院
   */
  const clickHospital = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showHospital.loading = true;
  };

  return { clickHiddenDangerPoint, clickHospital };
};
