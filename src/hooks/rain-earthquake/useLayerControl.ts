import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useStatusStore } from '@/stores/useStatusStore.ts';

/**
 * 控制面板显示隐藏逻辑
 */
export const useLayerControl = () => {
  const statusStore = useStatusStore();
  const leftLegendStore = useLeftLegendStore();
  /**
   * 点击显示医院
   */
  const clickHospital = () => {
    // 加载状态为true
    statusStore.poiLayers.showHospital.loading = true;
  };

  /**
   * 点击显示危险源
   */
  const clickDangerousSource = () => {
    // 加载状态为true
    statusStore.poiLayers.showDangerSource.loading = true;
  };

  /**
   * 点击显示避难所
   */
  const clickEmergencyShelter = () => {
    // 加载状态为true
    statusStore.poiLayers.showRefugeeShelter.loading = true;
  };

  /**
   * 点击显示消防站
   */
  const clickFireStation = () => {
    // 加载状态为true
    statusStore.poiLayers.showFireStation.loading = true;
  };

  /**
   * 点击显示物资储备点
   */
  const clickStorePoints = () => {
    // 加载状态为true
    statusStore.poiLayers.showReservePoint.loading = true;
  };

  /**
   *  点击显示学校
   */
  const clickSchool = () => {
    // 加载状态为true
    statusStore.poiLayers.showSchool.loading = true;
  };

  /**
   * 点击显示人口网格
   */
  const clickPopulationGrid = () => {
    // 加载状态为true
    statusStore.poiLayers.showPopulationGrid.loading = true;

    if (statusStore.poiLayers.showPopulationGrid.show) {
      // 添加图例
      leftLegendStore.legendListInfo.population = {
        title: '人口密度图例',
        list: [
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
        ],
      };
    } else {
      // 隐藏图例
      delete leftLegendStore.legendListInfo.population;
    }
  };

  /**
   * 显示管网
   */
  const clickWaterPipe = () => {
    statusStore.infrastructureLayers.showNetworkSystem.loading = true;
  };

  /**
   * 显示交通道路
   */
  const clickTrafficRoad = () => {
    statusStore.infrastructureLayers.showTrafficRoad.loading = true;
  };

  /**
   * 显示高速
   */
  const clickHighway = () => {
    statusStore.infrastructureLayers.showHighway.loading = true;
  };
  /**
   * 显示国道
   */
  const clickNationRoad = () => {
    statusStore.infrastructureLayers.showMainRoad.loading = true;
  };
  /**
   * 显示桥梁
   */
  const clickBridge = () => {
    statusStore.infrastructureLayers.showBridge.loading = true;
  };

  /**
   * 显示水库
   */
  const clickReservoir = () => {
    statusStore.infrastructureLayers.showReservoir.loading = true;
  };

  /**
   * 显示地铁站点
   */
  const clickSubwayStation = () => {
    statusStore.poiLayers.showSubwayStation.loading = true;
  };

  /**
   * 显示滑坡隐患点
   */
  const clickLandslideHiddenPoint = () => {
    statusStore.poiLayers.showLandslideHiddenPoint.loading = true;
  };

  /**
   * 显示泥石流隐患点
   */
  const clickDebrisFlowHiddenPoint = () => {
    statusStore.poiLayers.showDebrisFlowHiddenPoint.loading = true;
  };

  /**
   * 显示内涝隐患点
   */
  const clickWaterLoggingHiddenPoint = () => {
    statusStore.poiLayers.showWaterLoggingHiddenPoint.loading = true;
  };

  /**
   * 显示山洪隐患点
   */
  const clickFlashFloodHiddenPoint = () => {
    statusStore.poiLayers.showFlashFloodHiddenPoint.loading = true;
  };

  /**
   * 显示风险点
   */
  const clickRiskPoint = () => {
    statusStore.mapLayers.riskPointShow.loading = true;
  };

  /**
   * 显示断裂带
   */
  const clickFault = () => {
    statusStore.mapLayers.faultShow.loading = true;
  };

  /**
   * 显示降雨栅格
   */
  const clickRainfallGrid = () => {
    statusStore.weatherLayers.showRainfallGrid.loading = true;
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
