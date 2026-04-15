import { ref } from 'vue';
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
import type { PaginationType } from '@/types/common/PaginationType';
import { PointType } from '@/types/common/DisasterType';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import config from '@/config/config.json';
import { useStatusStore } from '@/stores/useStatusStore';
import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
import { LoadingResource } from '@/types/common/LoadingResourceType';

/**
 * 暴雨灾害链影响点列表钩子函数
 * @returns 搜索条件、表格数据、分页配置及相关方法
 */
export const useEarthquakeDisasterChain = () => {
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
    { value: PointType.RISK_AREA, label: '风险区' },
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
      callback: () => {
        CesiumUtilsSingleton.clearAllResources('custom');
      },
      executeOnce: true,
    },
    {
      name: '视角重置',
      callback: () => {
        CesiumUtilsSingleton.flyToTarget(
          config.defaultPosition as [number, number, number]
        );
      },
      executeOnce: true,
    },
  ];

  const controlPanel = ref([
    {
      name: '显示隐患点',
      selected: useStatusStore().mapLayers.hiddenDangerPointShow,
      callback: (status: unknown) => {
        if (status as boolean) {
          // 显示隐患点
          CesiumUtilsSingleton.batchShowPrimitives(
            useLoadingResourceStore().getLoadingResource(
              LoadingResource.HIDDEN_DANGER_POINT
            )
          );

          // 显示风险点
          CesiumUtilsSingleton.batchShowPrimitives(
            useLoadingResourceStore().getLoadingResource(
              LoadingResource.RISK_POINT
            )
          );
        } else {
          // 隐藏隐患点
          CesiumUtilsSingleton.batchHidePrimitives(
            useLoadingResourceStore().getLoadingResource(
              LoadingResource.HIDDEN_DANGER_POINT
            )
          );

          // 隐藏风险点
          CesiumUtilsSingleton.batchHidePrimitives(
            useLoadingResourceStore().getLoadingResource(
              LoadingResource.RISK_POINT
            )
          );
        }
      },
    },
    {
      name: '显示医院',
      selected: useStatusStore().poiLayers.showHospital,
      callback: () => {
        console.log('显示医院');
      },
    },
    {
      name: '显示危险源',
      selected: useStatusStore().poiLayers.showDangerSource,
      callback: () => {
        console.log('显示危险源');
      },
    },
    {
      name: '显示避难所',
      selected: useStatusStore().poiLayers.showRefugeeShelter,
      callback: () => {
        console.log('显示避难所');
      },
    },
    {
      name: '显示消防站',
      selected: useStatusStore().poiLayers.showFireStation,
      callback: () => {
        console.log('显示消防站');
      },
    },
    {
      name: '显示储备点',
      selected: useStatusStore().poiLayers.showReservePoint,
      callback: () => {
        console.log('显示储备点');
      },
    },
    {
      name: '显示学校',
      selected: useStatusStore().poiLayers.showSchool,
      callback: () => {
        console.log('显示学校');
      },
    },
    {
      name: '显示人口网格',
      selected: useStatusStore().poiLayers.showPopulationGrid,
      callback: () => {
        console.log('显示人口网格');
      },
    },
    {
      name: '显示管网系统',
      selected: useStatusStore().infrastructureLayers.showNetworkSystem,
      callback: () => {
        console.log('显示管网系统');
      },
    },
    {
      name: '显示交通道路',
      selected: useStatusStore().infrastructureLayers.showTrafficRoad,
      callback: () => {
        console.log('显示交通道路');
      },
    },
    {
      name: '显示桥梁',
      selected: useStatusStore().infrastructureLayers.showBridge,
      callback: () => {
        console.log('显示桥梁');
      },
    },
    {
      name: '显示高速',
      selected: useStatusStore().infrastructureLayers.showHighway,
      callback: () => {
        console.log('显示高速');
      },
    },
    {
      name: '显示国道',
      selected: useStatusStore().infrastructureLayers.showMainRoad,
      callback: () => {
        console.log('显示国道');
      },
    },
    {
      name: '显示水库',
      selected: useStatusStore().infrastructureLayers.showReservoir,
      callback: () => {
        console.log('显示水库');
      },
    },
    {
      name: '显示地铁站',
      selected: useStatusStore().infrastructureLayers.showReservoir,
      callback: () => {
        console.log('显示地铁站');
      },
    },
  ]);

  // 把所有需要用到的数据/方法 return 出去
  return {
    conditions,
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    leftButtonInfo,
    rightButtonInfo,
    controlPanel,
    changeConditions,
    changeCurrentPage,
  };
};
