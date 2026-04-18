import { ref } from 'vue';
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
import type { PaginationType } from '@/types/common/PaginationType';
import { PointType } from '@/types/common/DisasterType';
import { useStatusStore } from '@/stores/useStatusStore';
import {
  debrisFlowIcon,
  flashFloodIcon,
  landslideIcon,
  riskAreaIcon,
  waterLoggingIcon,
} from '@/assets';
import { useLayerControl } from '../useLayerControl';
import { useRightHandle } from '../useRightHandle';

/**
 * 暴雨灾害链
 * @returns
 */
export const useRainDisasterChain = () => {
  // ================灾害链影响点列表================================
  /**
   * 搜索条件
   */
  const conditions = ref({
    tableData: '',
    hiddenPoint: PointType.LANDSLIDE,
  });

  /**
   * 下拉选项
   */
  const selectOptions = [
    { value: PointType.LANDSLIDE, label: '滑坡' },
    { value: PointType.DEBRIS_FLOW, label: '泥石流' },
    { value: PointType.FLASH_FLOOD, label: '山洪' },
    { value: PointType.WATER_LOGGING, label: '内涝' },
  ];

  /**
   * 表格数据
   */
  const tableDatas = ref<XianHiddenDangerSpots[]>([]);

  /**
   * 表头配置
   */
  const tableColumns = [
    { title: '名称', key: 'disasterName' },
    { title: '位置', key: 'position' },
    { title: '规模等级', key: 'scaleGrade' },
    { title: '险情等级', key: 'riskGrade' },
  ];

  /**
   * 分页配置
   */
  const paginationConfig = ref<PaginationType>({
    currentPage: 1,
    pageSize: 10,
    total: 10,
    totalPage: 1,
  });

  /**
   * 修改搜索条件
   * @param value - 新的搜索条件
   */
  const changeConditions = (value: {
    tableData: string;
    hiddenPoint: PointType;
  }): void => {
    conditions.value = value;
  };

  /**
   * 修改页码
   * @param value - 新的页码
   */
  const changeCurrentPage = (value: number) => {
    paginationConfig.value.currentPage = value;
  };

  // ================图例================================
  /**
   * 图例数据
   */
  const legendList = [
    { name: '滑坡隐患点', link: landslideIcon },
    { name: '泥石流隐患点', link: debrisFlowIcon },
    { name: '山洪隐患点', link: flashFloodIcon },
    { name: '内涝隐患点', link: waterLoggingIcon },
    { name: '风险区域', link: riskAreaIcon },
  ];

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
      name: '暴雨内涝灾害链(50mm)',
      callback: () => {
        console.log('暴雨内涝灾害链(50mm)');
      },
    },
    {
      name: '暴雨滑坡灾害链(80mm)',
      callback: () => {
        console.log('暴雨滑坡灾害链(80mm)');
      },
    },
    {
      name: '暴雨洪涝灾害链(100mm)',
      callback: () => {
        console.log('暴雨洪涝灾害链(100mm)');
      },
    },
    {
      name: '暴雨山洪灾害链(110mm)',
      callback: () => {
        console.log('暴雨山洪灾害链(110mm)');
      },
    },
  ];

  // ================右侧按钮================================
  /**
   * 右侧按钮信息
   */
  const rightButtonInfo = [
    {
      name: '暴雨触发',
      callback: () => {
        console.log('暴雨触发');
      },
    },
    {
      name: '图件下载',
      callback: () => {
        console.log('图件下载');
      },
    },
    {
      name: '雷达云图',
      callback: () => {
        console.log('雷达云图');
      },
    },
    {
      name: '信息表格',
      callback: () => {
        console.log('信息表格');
      },
    },
    {
      name: '场景重置',
      callback: () => useRightHandle().resetScene(),
      executeOnce: true,
    },
    {
      name: '视角重置',
      callback: () => useRightHandle().resetView(),
      executeOnce: true,
    },
  ];

  // ================控制面板================================
  /**
   * 控制面板信息
   */
  /**
   * 控制面板信息
   */
  const getControlPanel = () => {
    const statusStore = useStatusStore();
    const layerControl = useLayerControl();

    return [
      {
        name: '显示医院',
        statusStore: statusStore.poiLayers,
        statusKey: 'showHospital' as const,
        callback: layerControl.clickHospital,
      },
      {
        name: '显示危险源',
        statusStore: statusStore.poiLayers,
        statusKey: 'showDangerSource' as const,
        callback: layerControl.clickDangerousSource,
      },
      {
        name: '显示避难所',
        statusStore: statusStore.poiLayers,
        statusKey: 'showRefugeeShelter' as const,
        callback: layerControl.clickEmergencyShelter,
      },
      {
        name: '显示消防站',
        statusStore: statusStore.poiLayers,
        statusKey: 'showFireStation' as const,
        callback: layerControl.clickFireStation,
      },
      {
        name: '显示储备点',
        statusStore: statusStore.poiLayers,
        statusKey: 'showReservePoint' as const,
        callback: layerControl.clickStorePoints,
      },
      {
        name: '显示学校',
        statusStore: statusStore.poiLayers,
        statusKey: 'showSchool' as const,
        callback: (status: unknown) => {
          console.log('显示学校', status);
        },
      },
      {
        name: '显示人口网格',
        statusStore: statusStore.poiLayers,
        statusKey: 'showPopulationGrid' as const,
        callback: (status: unknown) => {
          console.log('显示人口网格', status);
        },
      },
      {
        name: '显示管网系统',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showNetworkSystem' as const,
        callback: (status: unknown) => {
          console.log('显示管网系统', status);
        },
      },
      {
        name: '显示交通道路',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showTrafficRoad' as const,
        callback: (status: unknown) => {
          console.log('显示交通道路', status);
        },
      },
      {
        name: '显示桥梁',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showBridge' as const,
        callback: (status: unknown) => {
          console.log('显示桥梁', status);
        },
      },
      {
        name: '显示高速',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showHighway' as const,
        callback: (status: unknown) => {
          console.log('显示高速', status);
        },
      },
      {
        name: '显示国道',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showMainRoad' as const,
        callback: (status: unknown) => {
          console.log('显示国道', status);
        },
      },
      {
        name: '显示水库',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showReservoir' as const,
        callback: (status: unknown) => {
          console.log('显示水库', status);
        },
      },
      {
        name: '显示地铁站',
        statusStore: statusStore.infrastructureLayers,
        statusKey: 'showReservoir' as const,
        callback: (status: unknown) => {
          console.log('显示地铁站', status);
        },
      },
    ];
  };

  return {
    conditions,
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    legendList,
    leftButtonInfo,
    rightButtonInfo,
    changeConditions,
    changeCurrentPage,
    controlPanel: getControlPanel(),
  };
};
