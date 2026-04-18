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
    legendShow: {
      show: true,
      loading: true,
    },
    /** 灾情链影响点表格显示状态 */
    disasterChainPointShow: {
      show: false,
      loading: true,
    },
    leftButton: {
      show: true,
      loading: true,
    },
    rightButton: {
      show: true,
      loading: true,
    },
    controlPanel: {
      show: true,
      loading: true,
    },
  });

  // ============================ 地图图层显示状态 ================================

  /**
   * 地图基础图层显示状态
   */
  const mapLayers = reactive({
    /** 显示行政区划 */
    showAdministrativeDivision: {
      show: true,
      loading: true,
    },
    /** 隐患点显示状态 */
    hiddenDangerPointShow: {
      show: true,
      loading: true,
    },
    /** 风险点显示状态 */
    riskPointShow: {
      show: true,
      loading: true,
    },
    /** 断裂带显示状态 */
    faultShow: {
      show: true,
      loading: true,
    },
  });

  /**
   * POI图层显示状态
   */
  const poiLayers = reactive({
    /** 显示医院 */
    showHospital: {
      show: false,
      loading: false,
    },
    /** 显示危险源 */
    showDangerSource: {
      show: false,
      loading: false,
    },
    /** 显示避难所 */
    showRefugeeShelter: {
      show: false,
      loading: false,
    },
    /** 显示消防站 */
    showFireStation: {
      show: false,
      loading: false,
    },
    /** 显示储备点 */
    showReservePoint: {
      show: false,
      loading: false,
    },
    /** 显示学校 */
    showSchool: {
      show: false,
      loading: false,
    },
    /** 显示人口网格 */
    showPopulationGrid: {
      show: false,
      loading: false,
    },
    /** 显示地铁站 */
    showSubwayStation: {
      show: false,
      loading: false,
    },
  });

  /**
   * 基础设施图层显示状态
   */
  const infrastructureLayers = reactive({
    /** 显示管网系统 */
    showNetworkSystem: {
      show: false,
      loading: false,
    },
    /** 显示交通道路 */
    showTrafficRoad: {
      show: false,
      loading: false,
    },
    /** 显示桥梁 */
    showBridge: {
      show: false,
      loading: false,
    },
    /** 显示高速 */
    showHighway: {
      show: false,
      loading: false,
    },
    /** 显示国道 */
    showMainRoad: {
      show: false,
      loading: false,
    },
    /** 显示水库 */
    showReservoir: {
      show: false,
      loading: false,
    },
  });

  /**
   * 恢复默认值
   */
  const reset = () => {
    // 应用加载状态重置
    appLoadingCompleted.value = false;

    resetScene();
  };

  /**
   * 重置场景
   */
  const resetScene = () => {
    // UI 组件显示状态重置
    uiComponents.legendShow = {
      show: true,
      loading: true,
    };
    uiComponents.disasterChainPointShow = {
      show: false,
      loading: true,
    };
    uiComponents.leftButton = {
      show: true,
      loading: true,
    };
    uiComponents.rightButton = {
      show: true,
      loading: true,
    };
    uiComponents.controlPanel = {
      show: true,
      loading: true,
    };

    // 地图基础图层显示状态重置
    mapLayers.showAdministrativeDivision = {
      show: true,
      loading: true,
    };
    mapLayers.hiddenDangerPointShow = {
      show: true,
      loading: true,
    };
    mapLayers.riskPointShow = {
      show: true,
      loading: true,
    };

    // POI图层显示状态重置
    poiLayers.showHospital = {
      show: false,
      loading: false,
    };
    poiLayers.showDangerSource = {
      show: false,
      loading: false,
    };
    poiLayers.showRefugeeShelter = {
      show: false,
      loading: false,
    };
    poiLayers.showFireStation = {
      show: false,
      loading: false,
    };
    poiLayers.showReservePoint = {
      show: false,
      loading: false,
    };
    poiLayers.showSchool = {
      show: false,
      loading: false,
    };
    poiLayers.showPopulationGrid = {
      show: false,
      loading: false,
    };
    poiLayers.showSubwayStation = {
      show: false,
      loading: false,
    };

    // 基础设施图层显示状态重置
    infrastructureLayers.showNetworkSystem = {
      show: false,
      loading: false,
    };
    infrastructureLayers.showTrafficRoad = {
      show: false,
      loading: false,
    };
    infrastructureLayers.showBridge = {
      show: false,
      loading: false,
    };
    infrastructureLayers.showHighway = {
      show: false,
      loading: false,
    };
    infrastructureLayers.showMainRoad = {
      show: false,
      loading: false,
    };
    infrastructureLayers.showReservoir = {
      show: false,
      loading: false,
    };
  };

  return {
    appLoadingCompleted,
    uiComponents,
    mapLayers,
    poiLayers,
    infrastructureLayers,
    reset,
    resetScene,
  };
});
