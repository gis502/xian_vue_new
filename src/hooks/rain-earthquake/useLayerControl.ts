import { useStatusStore } from '@/stores/useStatusStore.ts';

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

  /**
   * 点击显示危险源
   */
  const clickDangerousSource = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showDangerSource.loading = true;
  };

  /**
   * 点击显示避难所
   */
  const clickEmergencyShelter = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showRefugeeShelter.loading = true;
  };

  /**
   * 点击显示消防站
   */
  const clickFireStation = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showFireStation.loading = true;
  };

  /**
   * 点击显示物资储备点
   */
  const clickStorePoints = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showReservePoint.loading = true;
  };

  /**
   * 点击显示人口网格
   */
  const clickPopulationGrid = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showPopulationGrid.loading = true;
  };

  /**
   * 显示管网
   */
  const clickWaterPipe = () => {
    useStatusStore().infrastructureLayers.showNetworkSystem.loading = true;
  };

  return {
    clickHiddenDangerPoint,
    clickHospital,
    clickDangerousSource,
    clickEmergencyShelter,
    clickFireStation,
    clickStorePoints,
    clickPopulationGrid,
    clickWaterPipe,
  };
};
