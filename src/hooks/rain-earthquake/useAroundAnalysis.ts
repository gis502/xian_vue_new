import { computed, ref } from 'vue';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import { useStatusStore } from '@/stores/useStatusStore';
import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
import { LoadingResource } from '@/types/common/LoadingResourceType';
import type { PointResource, ResourceConfig } from '@/types/common/useAroundAnalysisType';

/**
 * 周边分析搜索组件钩子函数
 * @returns 搜索相关的状态和方法
 */
export const useAroundAnalysis = () => {
  const statusStore = useStatusStore();//用于访问图层显示状态
  const loadingResourceStore = useLoadingResourceStore();//用于访问各类点位数据
  // 计算属性：获取图层的显示状态
  const poi = computed(() => statusStore.poiLayers);
  const map = computed(() => statusStore.mapLayers);
  const infra = computed(() => statusStore.infrastructureLayers);

  /**
   * 资源配置列表
   */
  const RESOURCE_CONFIGS: ResourceConfig[] = [
    { key: LoadingResource.SCHOOL, category: 'school', isVisible: () => poi.value.showSchool.show },
    { key: LoadingResource.HOSPITAL, category: 'hospital', isVisible: () => poi.value.showHospital.show },
    { key: LoadingResource.DANGEROUS_SOURCE, category: 'danger', isVisible: () => poi.value.showDangerSource.show },
    { key: LoadingResource.EMERGENCY_SHELTER, category: 'shelter', isVisible: () => poi.value.showRefugeeShelter.show },
    { key: LoadingResource.FIRE_STATION, category: 'fire', isVisible: () => poi.value.showFireStation.show },
    { key: LoadingResource.STORE_POINTS, category: 'store', isVisible: () => poi.value.showReservePoint.show },
    { key: LoadingResource.SUBWAY_STATION, category: 'subway', isVisible: () => poi.value.showSubwayStation.show },
    { key: LoadingResource.LANDSLIDE_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'landslide', isVisible: () => poi.value.showLandslideHiddenPoint.show },
    { key: LoadingResource.DEBRIS_FLOW_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'debris_flow', isVisible: () => poi.value.showDebrisFlowHiddenPoint.show },
    { key: LoadingResource.WATER_LOGGING_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'water_logging', isVisible: () => poi.value.showWaterLoggingHiddenPoint.show },
    { key: LoadingResource.FLASH_FLOOD_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'flash_flood', isVisible: () => poi.value.showFlashFloodHiddenPoint.show },
    { key: LoadingResource.RISK_POINT, category: 'risk-point', isVisible: () => map.value.riskPointShow.show },
    { key: LoadingResource.BRIDGE, category: 'bridge', isVisible: () => infra.value.showBridge.show },
    { key: LoadingResource.RESERVOIR, category: 'reservoir', isVisible: () => infra.value.showReservoir.show },
  ];

  /**
   * 所有资源数据
   */
  const allResources = ref<PointResource[]>([]);

  /**
   * 计算属性：判断是否允许搜索
   */
  const canSearch = computed(() => {
    return RESOURCE_CONFIGS.some(config => config.isVisible());
  });

  /**
   * 查询建议回调
   * @param queryString - 搜索字符串
   * @param cb - 回调函数
   */
  function querySearch(queryString: string, cb: (results: PointResource[]) => void) {
    if (!canSearch.value) {
      cb([]);
      return;
    }

    const lowerQuery = queryString.toLowerCase();
    const filteredResults = allResources.value.filter(item => {
      const config = RESOURCE_CONFIGS.find(c => c.category === item.category);
      let isVisible = false;
      if (config) {
        if (item.category === 'hidden-danger') {
          const type = (item.originalType as string)?.toLowerCase();
          isVisible = (type === config.forcedType?.toLowerCase()) && config.isVisible();
        } else {
          isVisible = config.isVisible();
        }
      }

      if (!isVisible) return false;
      if (!queryString) return true;
      const matchStr = (item.value || '').toLowerCase();
      return matchStr.includes(lowerQuery);
    });

    cb(filteredResults);
  }

  /**
   * 选择建议回调
   * @param item - 选中的点资源
   */
  function handleSelect(item: PointResource) {
    if (item.lon != null && item.lat != null) {
      CesiumUtilsSingleton.flyToTarget([item.lon, item.lat, 6000]);
    }
  }

  /**
   * 处理聚焦事件，重新加载数据
   */
  function handleFocus() {
    loadAllPointData();
  }

  /**
   * 数据处理：将 Store 数据转换为资源格式
   * @param infoList - 原始数据列表
   * @param category - 资源分类
   * @param forcedType - 强制类型
   * @returns 转换后的点资源数组
   */
  function convertStoreDataToResources(
    infoList: Record<string, unknown>[],
    category: PointResource['category'],
    forcedType?: string,
  ): PointResource[] {
    if (!Array.isArray(infoList)) return [];

    return infoList.map((item: Record<string, unknown>) => {
      const id = item.id || item._id || item.uuid || 'unknown_id';
      const safeId = typeof id === 'string' ? id : typeof id === 'number' ? id : 'unknown_id';

      const value = (item.name && String(item.name).trim() !== '')
        ? String(item.name)
        : String(safeId);

      return {
        ...item,
        id: safeId,
        value: value,
        category: category,
        originalType: (forcedType || (item.type as string) || (item.disasterType as string))?.toLowerCase(),
      };
    });
  }

  /**
   * 加载所有点类数据
   */
  function loadAllPointData() {
    const resources: PointResource[] = [];

    RESOURCE_CONFIGS.forEach(config => {
      const data = loadingResourceStore.getLoadingResource(config.key).info;
      resources.push(...convertStoreDataToResources(data, config.category, config.forcedType));
    });

    const seenIds = new Map<string | number, PointResource>();
    const uniqueResources: PointResource[] = [];
    for (const item of resources) {
      if (!seenIds.has(item.id)) {
        seenIds.set(item.id, item);
        uniqueResources.push(item);
      }
    }

    allResources.value = uniqueResources;
  }

  /**
   * 搜索框的值
   */
  const state = ref('');

  return { state, allResources, canSearch, querySearch, handleSelect, handleFocus, loadAllPointData };
};
