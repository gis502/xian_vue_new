import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useStatusStore } from '@/stores/useStatusStore.ts';

/**
 * 控制面板显示隐藏逻辑
 */
export const useLayerControl = () => {
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
   *  点击显示学校
   */
  const clickSchool = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showSchool.loading = true;
  };

  /**
   * 点击显示人口网格
   */
  const clickPopulationGrid = () => {
    // 加载状态为true
    useStatusStore().poiLayers.showPopulationGrid.loading = true;

    if (useStatusStore().poiLayers.showPopulationGrid.show) {
      // 显示图例
      useStatusStore().uiComponents.leftLegend.loading = true;
      useStatusStore().uiComponents.leftLegend.show = true;

      useLeftLegendStore().legendListInfo.title = '人口密度图例';
      useLeftLegendStore().legendListInfo.list = [
        {
          label: 'Min-0 < 100',
          color: '#b1fe02',
        },
        {
          label: '100 ≤ X < 500',
          color: '#6bf700',
        },
        {
          label: '500 ≤ X < 1000',
          color: '#fcf600',
        },
        {
          label: '1000 ≤ X < 2000',
          color: '#fecb02',
        },
        {
          label: '2000 ≤ X < 4000',
          color: '#fc9e00',
        },
        {
          label: '4000 ≤ X < 8000',
          color: '#fe7004',
        },
        {
          label: '8000 ≤ X < 10000',
          color: '#fb3f02',
        },
        {
          label: '10000 ≤ X < Max',
          color: '#ff0000',
        },
      ];
    } else {
      // 隐藏图例
      useStatusStore().uiComponents.leftLegend.show = false;
    }
  };

  /**
   * 显示管网
   */
  const clickWaterPipe = () => {
    useStatusStore().infrastructureLayers.showNetworkSystem.loading = true;
  };

  /**
   * 显示交通道路
   */
  const clickTrafficRoad = () => {
    useStatusStore().infrastructureLayers.showTrafficRoad.loading = true;
  };

  /**
   * 显示高速
   */
  const clickHighway = () => {
    useStatusStore().infrastructureLayers.showHighway.loading = true;
  };
  /**
   * 显示国道
   */
  const clickNationRoad = () => {
    useStatusStore().infrastructureLayers.showMainRoad.loading = true;
  };
  /**
   * 显示桥梁
   */
  const clickBridge = () => {
    useStatusStore().infrastructureLayers.showBridge.loading = true;
  };

  /**
   * 显示水库
   */
  const clickReservoir = () => {
    useStatusStore().infrastructureLayers.showReservoir.loading = true;
  };

  /**
   * 显示地铁站点
   */
  const clickSubwayStation = () => {
    useStatusStore().poiLayers.showSubwayStation.loading = true;
  };

  /**
   * 显示滑坡隐患点
   */
  const clickLandslideHiddenPoint = () => {
    useStatusStore().poiLayers.showLandslideHiddenPoint.loading = true;
  };

  /**
   * 显示泥石流隐患点
   */
  const clickDebrisFlowHiddenPoint = () => {
    useStatusStore().poiLayers.showDebrisFlowHiddenPoint.loading = true;
  };

  /**
   * 显示内涝隐患点
   */
  const clickWaterLoggingHiddenPoint = () => {
    useStatusStore().poiLayers.showWaterLoggingHiddenPoint.loading = true;
  };

  /**
   * 显示山洪隐患点
   */
  const clickFlashFloodHiddenPoint = () => {
    useStatusStore().poiLayers.showFlashFloodHiddenPoint.loading = true;
  };

  /**
   * 显示风险点
   */
  const clickRiskPoint = () => {
    useStatusStore().mapLayers.riskPointShow.loading = true;
  };

  /**
   * 显示断裂带
   */
  const clickFault = () => {
    useStatusStore().mapLayers.faultShow.loading = true;
  };

  /**
   * 显示降雨栅格
   */
  const clickRainfallGrid = () => {
    useStatusStore().weatherLayers.showRainfallGrid.loading = true;
  };

  return {
    clickRiskPoint,
    clickFault,
    clickHospital,
    clickDangerousSource,
    clickEmergencyShelter,
    clickFireStation,
    clickStorePoints,
    clickSchool,
    clickPopulationGrid,
    clickWaterPipe,
    clickTrafficRoad,
    clickHighway,
    clickNationRoad,
    clickBridge,
    clickReservoir,
    clickSubwayStation,
    clickLandslideHiddenPoint,
    clickDebrisFlowHiddenPoint,
    clickWaterLoggingHiddenPoint,
    clickFlashFloodHiddenPoint,
    clickRainfallGrid,
  };
};
