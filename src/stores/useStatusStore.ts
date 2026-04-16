import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

/**
 * 全局状态管理
 * @returns 应用状态及相关方法
 */
export const useStatusStore = defineStore('status', () => {
  // ============================ 应用级状态 ================================

  /**
   * 应用加载完成状态
   */
  const appLoadingCompleted = ref(false);

  // ============================ UI 组件显示状态 ================================

  /**
   * UI 组件显示状态集合
   */
  const uiComponents = reactive({
    /** 图例显示状态 */
    legendShow: true,
    /** 灾情链影响点表格显示状态 */
    disasterChainPointShow: false,
  });

  // ============================ 地图图层显示状态 ================================

  /**
   * 地图基础图层显示状态
   */
  const mapLayers = reactive({
    /** 显示行政区划 */
    showAdministrativeDivision: true,
    /** 隐患点显示状态 */
    hiddenDangerPointShow: true,
    /** 风险点显示状态 */
    riskPointShow: true,
    /** 断裂带显示状态 */
    faultShow: true,
  });

  /**
   * POI图层显示状态
   */
  const poiLayers = reactive({
    /** 显示医院 */
    showHospital: false,
    /** 显示危险源 */
    showDangerSource: false,
    /** 显示避难所 */
    showRefugeeShelter: false,
    /** 显示消防站 */
    showFireStation: false,
    /** 显示储备点 */
    showReservePoint: false,
    /** 显示学校 */
    showSchool: false,
    /** 显示人口网格 */
    showPopulationGrid: false,
    /** 显示地铁站 */
    showSubwayStation: false,
  });

  /**
   * 基础设施图层显示状态
   */
  const infrastructureLayers = reactive({
    /** 显示管网系统 */
    showNetworkSystem: false,
    /** 显示交通道路 */
    showTrafficRoad: false,
    /** 显示桥梁 */
    showBridge: false,
    /** 显示高速 */
    showHighway: false,
    /** 显示国道 */
    showMainRoad: false,
    /** 显示水库 */
    showReservoir: false,
  });

  /**
   * 恢复默认值
   */
  const reset = () => {
    // 应用加载状态重置
    appLoadingCompleted.value = false;

    // UI 组件显示状态重置
    uiComponents.legendShow = true;
    uiComponents.disasterChainPointShow = false;

    // 地图基础图层显示状态重置
    mapLayers.showAdministrativeDivision = true;
    mapLayers.hiddenDangerPointShow = true;
    mapLayers.riskPointShow = true;

    // POI图层显示状态重置
    poiLayers.showHospital = false;
    poiLayers.showDangerSource = false;
    poiLayers.showRefugeeShelter = false;
    poiLayers.showFireStation = false;
    poiLayers.showReservePoint = false;
    poiLayers.showSchool = false;
    poiLayers.showPopulationGrid = false;
    poiLayers.showSubwayStation = false;

    // 基础设施图层显示状态重置
    infrastructureLayers.showNetworkSystem = false;
    infrastructureLayers.showTrafficRoad = false;
    infrastructureLayers.showBridge = false;
    infrastructureLayers.showHighway = false;
    infrastructureLayers.showMainRoad = false;
    infrastructureLayers.showReservoir = false;
  };

  return {
    appLoadingCompleted,
    uiComponents,
    mapLayers,
    poiLayers,
    infrastructureLayers,
    reset,
  };
});
