import { ControlPanelCategory } from '@/types/common/ControlPanelCategory';
import { useStatusStore } from '@/stores/useStatusStore';
import { useLayerControl } from '../rain-earthquake/useLayerControl.ts';
import {
  debrisFlowIcon,
  landslideIcon,
  riskAreaIcon,
  earthquakeLineIcon,
  hospitalIcon,
  dangerousSourceIcon,
  emergencyShelterIcon,
  firefighterIcon,
  storePointsIcon,
  schoolIcon,
  bridgeIcon,
  reservoirIcon,
  subwayIcon,
} from '@/assets';
import { useRightHandle } from '../rain-earthquake/useRightHandle.ts';
import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';
import { LoadingResource } from '@/types/common/LoadingResourceType.ts';

/**
 * 地震灾害链
 * @returns
 */
export const useEarthquakeDisasterChain = () => {
  const statusStore = useStatusStore();
  const layerControl = useLayerControl();
  const resourceStore = useLoadingResourceStore();
  const rightHandle = useRightHandle();

  // ================左侧按钮================================
  /**
   * 左侧按钮信息
   */
  const leftButtonInfo = [
    {
      name: '周边分析',
      callback: () => {
        console.log('周边分析');
      },
    },
    {
      name: '关联分析',
      callback: () => {
        console.log('关联分析');
      },
    },
    {
      name: '次生衍生灾害链分析',
      callback: () => {
        console.log('次生衍生灾害链分析');
      },
    },
    {
      name: '历史相似性分析',
      callback: () => {
        console.log('历史相似性分析');
      },
    },
    {
      name: '灾害链模型库测试',
      callback: () => {
        console.log('灾害链模型库测试');
      },
    },
    {
      name: '承灾体信息提取',
      callback: () => {
        console.log('承灾体信息提取');
      },
    },
    {
      name: '地震滑坡堰塞湖泥石流(7级)',
      callback: () => {
        console.log('地震滑坡堰塞湖泥石流(7级)');
      },
    },
    {
      name: '地震滑坡堰塞湖泥石流(8级)',
      callback: () => {
        console.log('地震滑坡堰塞湖泥石流(8级)');
      },
    },
  ];

  // ================右侧按钮================================
  /**
   * 右侧按钮信息
   */
  const rightButtonInfo = [
    {
      name: '地震模拟',
      callback: () => {
        console.log('地震模拟');
      },
    },
    {
      name: '图件下载',
      callback: () => {
        console.log('图件下载');
      },
    },
    {
      name: '清除模拟',
      callback: () => rightHandle.resetScene(),
      executeOnce: true,
    },
    {
      name: '视角重置',
      callback: () => rightHandle.resetView(),
      executeOnce: true,
    },
  ];

  // ================控制面板================================
  /**
   * 控制面板信息
   */
  const getControlPanel = () => {

    return [
      // 灾害隐患点类别
      {
        name: '滑坡隐患点',
        statusStore: statusStore.poiLayers,
        statusKey: 'showLandslideHiddenPoint' as const,
        callback: layerControl.clickLandslideHiddenPoint,
        link: landslideIcon,
        category: ControlPanelCategory.DISASTER_HAZARD,
        count: () =>
          resourceStore.getResourceCount(
            LoadingResource.LANDSLIDE_HIDDEN_POINT
          ),
      },
      {
        name: '泥石流隐患点',
        statusStore: statusStore.poiLayers,
        statusKey: 'showDebrisFlowHiddenPoint' as const,
        callback: layerControl.clickDebrisFlowHiddenPoint,
        link: debrisFlowIcon,
        category: ControlPanelCategory.DISASTER_HAZARD,
        count: () =>
          resourceStore.getResourceCount(
            LoadingResource.DEBRIS_FLOW_HIDDEN_POINT
          ),
      },
      {
        name: '风险点',
        statusStore: statusStore.mapLayers,
        statusKey: 'riskPointShow' as const,
        callback: layerControl.clickRiskPoint,
        link: riskAreaIcon,
        category: ControlPanelCategory.DISASTER_HAZARD,
        count: () => resourceStore.getResourceCount(LoadingResource.RISK_POINT),
      },
      {
        name: '断裂带',
        statusStore: statusStore.mapLayers,
        statusKey: 'faultShow' as const,
        callback: layerControl.clickFault,
        link: earthquakeLineIcon,
        category: ControlPanelCategory.DISASTER_HAZARD,
      },
      // 基础设施类别
      {
        name: '医院',
        statusStore: statusStore.poiLayers,
        statusKey: 'showHospital' as const,
        callback: layerControl.clickHospital,
        link: hospitalIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () => resourceStore.getResourceCount(LoadingResource.HOSPITAL),
      },
      {
        name: '危险源',
        statusStore: statusStore.poiLayers,
        statusKey: 'showDangerSource' as const,
        callback: layerControl.clickDangerousSource,
        link: dangerousSourceIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () =>
          resourceStore.getResourceCount(LoadingResource.DANGEROUS_SOURCE),
      },
      {
        name: '避难所',
        statusStore: statusStore.poiLayers,
        statusKey: 'showRefugeeShelter' as const,
        callback: layerControl.clickEmergencyShelter,
        link: emergencyShelterIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () =>
          resourceStore.getResourceCount(LoadingResource.EMERGENCY_SHELTER),
      },
      {
        name: '消防站',
        statusStore: statusStore.poiLayers,
        statusKey: 'showFireStation' as const,
        callback: layerControl.clickFireStation,
        link: firefighterIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () =>
          resourceStore.getResourceCount(LoadingResource.FIRE_STATION),
      },
      {
        name: '储备点',
        statusStore: statusStore.poiLayers,
        statusKey: 'showReservePoint' as const,
        callback: layerControl.clickStorePoints,
        link: storePointsIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () =>
          resourceStore.getResourceCount(LoadingResource.STORE_POINTS),
      },
      {
        name: '学校',
        statusStore: statusStore.poiLayers,
        statusKey: 'showSchool' as const,
        callback: layerControl.clickSchool,
        link: schoolIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () => resourceStore.getResourceCount(LoadingResource.SCHOOL),
      },
      {
        name: '桥梁',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showBridge' as const,
        callback: layerControl.clickBridge,
        link: bridgeIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () => resourceStore.getResourceCount(LoadingResource.BRIDGE),
      },
      {
        name: '水库',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showReservoir' as const,
        callback: layerControl.clickReservoir,
        link: reservoirIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () => resourceStore.getResourceCount(LoadingResource.RESERVOIR),
      },
      {
        name: '地铁站',
        statusStore: statusStore.poiLayers,
        statusKey: 'showSubwayStation' as const,
        callback: layerControl.clickSubwayStation,
        link: subwayIcon,
        category: ControlPanelCategory.INFRASTRUCTURE,
        count: () =>
          resourceStore.getResourceCount(LoadingResource.SUBWAY_STATION),
      },
      {
        name: '人口网格',
        statusStore: statusStore.poiLayers,
        statusKey: 'showPopulationGrid' as const,
        callback: layerControl.clickPopulationGrid,
        category: ControlPanelCategory.INFRASTRUCTURE,
      },
      {
        name: '管网系统',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showNetworkSystem' as const,
        callback: layerControl.clickWaterPipe,
        category: ControlPanelCategory.INFRASTRUCTURE,
      },
      {
        name: '交通道路',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showTrafficRoad' as const,
        callback: layerControl.clickTrafficRoad,
        category: ControlPanelCategory.INFRASTRUCTURE,
      },

      {
        name: '高速',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showHighway' as const,
        callback: layerControl.clickHighway,
        category: ControlPanelCategory.INFRASTRUCTURE,
      },
      {
        name: '国道',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showMainRoad' as const,
        callback: layerControl.clickNationRoad,
        category: ControlPanelCategory.INFRASTRUCTURE,
      },
    ];
  };

  return {
    leftButtonInfo,
    rightButtonInfo,
    controlPanel: getControlPanel(),
  };
};
