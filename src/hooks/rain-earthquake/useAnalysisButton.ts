import { ref, reactive, onUnmounted, watch, computed } from 'vue';
import { useStatusStore } from '@/stores/useStatusStore';
import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
import { LoadingResource } from '@/types/common/LoadingResourceType';
import type { 
  PointResource, 
  PointResourceCategory, 
  ButtonResourceConfig,
  AnalysisButtonConfig,
  DialogPosition,
  AnalysisButtonState
} from '@/types/common/useAroundAnalysisType';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian2,
  Cartographic,
  Cartesian3,
} from 'cesium';
import { useCircleDrawer } from './useCircleDrawer';
import { usePulseEffect } from './usePulseEffect';
import { useMarkerManager } from './useMarkerManager';

// ==================== 常量配置 ====================
const DIALOG_WIDTH = 280;
const DIALOG_HEIGHT = 150;
const DIALOG_PADDING = 10;
const DIALOG_OFFSET = 20;
const EARTH_RADIUS = 6371000;
const MIN_FLY_HEIGHT = 10000;
const FLY_HEIGHT_MULTIPLIER = 6000;
const FLY_DURATION = 2;

// ==================== Store 实例 ====================
const statusStore = useStatusStore();
const loadingResourceStore = useLoadingResourceStore();

const poi = computed(() => statusStore.poiLayers);
const map = computed(() => statusStore.mapLayers);
const infra = computed(() => statusStore.infrastructureLayers);

// ==================== 资源配置 ====================
const RESOURCE_CONFIGS: ButtonResourceConfig[] = [
  { key: LoadingResource.SCHOOL, category: 'school' },
  { key: LoadingResource.HOSPITAL, category: 'hospital' },
  { key: LoadingResource.DANGEROUS_SOURCE, category: 'danger' },
  { key: LoadingResource.EMERGENCY_SHELTER, category: 'shelter' },
  { key: LoadingResource.FIRE_STATION, category: 'fire' },
  { key: LoadingResource.STORE_POINTS, category: 'store' },
  { key: LoadingResource.SUBWAY_STATION, category: 'subway' },
  { key: LoadingResource.LANDSLIDE_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'landslide' },
  { key: LoadingResource.DEBRIS_FLOW_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'debris_flow' },
  { key: LoadingResource.WATER_LOGGING_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'water_logging' },
  { key: LoadingResource.FLASH_FLOOD_HIDDEN_POINT, category: 'hidden-danger', forcedType: 'flash_flood' },
  { key: LoadingResource.RISK_POINT, category: 'risk-point' },
  { key: LoadingResource.BRIDGE, category: 'bridge' },
  { key: LoadingResource.RESERVOIR, category: 'reservoir' },
];

// ==================== 图层可见性判断 ====================
const isCategoryVisible = (category: PointResourceCategory, originalType?: string): boolean => {
  const visibilityMap: Record<string, () => boolean> = {
    school: () => poi.value.showSchool.show,
    hospital: () => poi.value.showHospital.show,
    danger: () => poi.value.showDangerSource.show,
    shelter: () => poi.value.showRefugeeShelter.show,
    fire: () => poi.value.showFireStation.show,
    store: () => poi.value.showReservePoint.show,
    subway: () => poi.value.showSubwayStation.show,
    'risk-point': () => map.value.riskPointShow.show,
    bridge: () => infra.value.showBridge.show,
    reservoir: () => infra.value.showReservoir.show,
    'hidden-danger': () => {
      const hiddenMap: Record<string, () => boolean> = {
        landslide: () => poi.value.showLandslideHiddenPoint.show,
        debris_flow: () => poi.value.showDebrisFlowHiddenPoint.show,
        water_logging: () => poi.value.showWaterLoggingHiddenPoint.show,
        flash_flood: () => poi.value.showFlashFloodHiddenPoint.show,
      };
      return hiddenMap[originalType || '']?.() ?? false;
    },
  }; 
  return visibilityMap[category]?.() ?? false;
};

// ==================== 响应式状态 ====================
export const useAnalysisButton = (): AnalysisButtonState => {
  const selectedButtonIndex = ref<number>(-1);
  const showAreaDialog = ref(false);
  const radius = ref(10);
  const dialogPosition = reactive<DialogPosition>({ x: 0, y: 0 });

  let clickHandler: ScreenSpaceEventHandler | null = null;
  let currentCenterPosition: Cartesian3 | null = null;

  // ==================== 组合子 Hook ====================
  const { drawCircle, clearCircle } = useCircleDrawer();
  const { addPulseEffectToPoints, removePulseEffect } = usePulseEffect();
  const { addMarker, removeMarker } = useMarkerManager();

  // ==================== 数据加载与计算 ====================

  const loadAllPointData = (): PointResource[] => {
    const resources: PointResource[] = [];
    
    RESOURCE_CONFIGS.forEach(config => {
      const data = loadingResourceStore.getLoadingResource(config.key).info;
      if (Array.isArray(data)) {
        const convertedData = data.map((item: Record<string, unknown>) => {
          const id = item.id || item._id || item.uuid || 'unknown_id';
          const safeId = typeof id === 'string' ? id : typeof id === 'number' ? id : 'unknown_id';
          const value = (item.name && String(item.name).trim() !== '') 
            ? String(item.name) 
            : String(safeId);

          return {
            ...item,
            id: safeId,
            value,
            category: config.category,
            originalType: (config.forcedType || (item.type as string) || (item.disasterType as string))?.toLowerCase()
          };
        });
        resources.push(...convertedData);
      }
    });

    const seenIds = new Map<string | number, PointResource>();
    for (const item of resources) {
      if (!seenIds.has(item.id)) {
        seenIds.set(item.id, item);
      }
    }

    const uniqueResources = Array.from(seenIds.values());
    console.log('加载的点数据总数:', uniqueResources.length);
    return uniqueResources;
  };

  const calculateDistance = (
    centerLon: number, 
    centerLat: number, 
    pointLon: unknown, 
    pointLat: unknown
  ): number => {
    const pLon = Number(pointLon);
    const pLat = Number(pointLat);
    
    if (isNaN(pLon) || isNaN(pLat)) return Infinity;

    const dLat = (pLat - centerLat) * Math.PI / 180;
    const dLon = (pLon - centerLon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(centerLat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getPointsInCircle = (centerPosition: Cartesian3, radiusKm: number): PointResource[] => {
    const cartographic = Cartographic.fromCartesian(centerPosition);
    const centerLon = cartographic.longitude * (180 / Math.PI);
    const centerLat = cartographic.latitude * (180 / Math.PI);
    
    const allPoints = loadAllPointData();
    const radiusMeters = radiusKm * 1000;
    
    return allPoints.filter(point => {
      if (point.lon === undefined || point.lat === undefined) return false;
      
      const distance = calculateDistance(centerLon, centerLat, point.lon, point.lat);
      return distance <= radiusMeters && isCategoryVisible(point.category as PointResourceCategory, point.originalType);
    });
  };

  /**
   * 刷新脉冲效果
   */
  const refreshPulseEffect = () => {
    if (!currentCenterPosition) return;
    
    console.log('刷新脉冲效果...');
    removePulseEffect();
    
    const pointsInCircle = getPointsInCircle(currentCenterPosition, radius.value);
    addPulseEffectToPoints(pointsInCircle);
  };

  // ==================== 地图事件处理 ====================

  const registerMapClickHandler = () => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer) return;

    clickHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    clickHandler.setInputAction((clickEvent: { position: Cartesian2 }) => {
      const cartesian = viewer.camera.pickEllipsoid(clickEvent.position, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        currentCenterPosition = cartesian;
        const cartographic = Cartographic.fromCartesian(cartesian);
        const longitude = cartographic.longitude * (180 / Math.PI);
        const latitude = cartographic.latitude * (180 / Math.PI);

        console.log('点击位置:', { longitude, latitude });
        addMarker(cartesian);
        showAreaDialog.value = true;
        calculateDialogPosition(clickEvent.position);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  };

  const removeMapClickHandler = () => {
    if (clickHandler) {
      clickHandler.destroy();
      clickHandler = null;
    }
  };

  const calculateDialogPosition = (clickPosition: Cartesian2) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    let x = clickPosition.x + DIALOG_OFFSET;
    let y = clickPosition.y + DIALOG_OFFSET;
    
    if (x + DIALOG_WIDTH > screenWidth - DIALOG_PADDING) {
      x = clickPosition.x - DIALOG_WIDTH - DIALOG_OFFSET;
    }
    
    if (y + DIALOG_HEIGHT > screenHeight - DIALOG_PADDING) {
      y = clickPosition.y - DIALOG_HEIGHT - DIALOG_OFFSET;
    }
    
    dialogPosition.x = Math.max(DIALOG_PADDING, Math.min(x, screenWidth - DIALOG_WIDTH - DIALOG_PADDING));
    dialogPosition.y = Math.max(DIALOG_PADDING, Math.min(y, screenHeight - DIALOG_HEIGHT - DIALOG_PADDING));
  };

  // ==================== 资源清理 ====================

  const clearAllAnalysisResources = () => {
    removeMarker();
    clearCircle();
    removePulseEffect();
    currentCenterPosition = null;
  };

  // ==================== 事件处理 ====================

  const handleConfirm = () => {
    if (!currentCenterPosition) {
      console.error('中心点位置不存在');
      return;
    }

    console.log('确认添加区域分析', {
      radius: radius.value,
      center: currentCenterPosition
    });

    drawCircle(currentCenterPosition, radius.value);

    const pointsInCircle = getPointsInCircle(currentCenterPosition, radius.value);
    addPulseEffectToPoints(pointsInCircle);

    const cartographic = Cartographic.fromCartesian(currentCenterPosition);
    const longitude = cartographic.longitude * (180 / Math.PI);
    const latitude = cartographic.latitude * (180 / Math.PI);

    const flyHeight = Math.max(radius.value * FLY_HEIGHT_MULTIPLIER, MIN_FLY_HEIGHT);
    CesiumUtilsSingleton.flyToTarget([longitude, latitude, flyHeight], FLY_DURATION);
    showAreaDialog.value = false;
  };

  const handleCancel = () => {
    showAreaDialog.value = false;
    clearAllAnalysisResources();
  };

  const handleButtonClick = (index: number, callback: (status: boolean) => void) => {
    const isActive = selectedButtonIndex.value === index;
    
    if (isActive) {
      selectedButtonIndex.value = -1;
      callback(false);
    } else {
      if (selectedButtonIndex.value !== -1) {
        clearAllAnalysisResources();
        showAreaDialog.value = false;
      }
      selectedButtonIndex.value = index;
      callback(true);
    }
  };

  // ==================== 监听器 ====================

  watch(
    () => loadingResourceStore.loadingResource,
    () => {
      console.log('检测到资源数据变化，刷新脉冲效果');
      refreshPulseEffect();
    },
    { deep: true }
  );

  const layerVisibilityWatchers = [
    () => poi.value.showSchool.show,
    () => poi.value.showHospital.show,
    () => poi.value.showDangerSource.show,
    () => poi.value.showRefugeeShelter.show,
    () => poi.value.showFireStation.show,
    () => poi.value.showReservePoint.show,
    () => poi.value.showSubwayStation.show,
    () => poi.value.showLandslideHiddenPoint.show,
    () => poi.value.showDebrisFlowHiddenPoint.show,
    () => poi.value.showWaterLoggingHiddenPoint.show,
    () => poi.value.showFlashFloodHiddenPoint.show,
    () => map.value.riskPointShow.show,
    () => infra.value.showBridge.show,
    () => infra.value.showReservoir.show,
  ];

  watch(layerVisibilityWatchers, () => {
    console.log('检测到图层可见性变化，刷新脉冲效果');
    refreshPulseEffect();
  });

  onUnmounted(() => {
    clearAllAnalysisResources();
    removeMapClickHandler();
  });

  // ==================== 按钮配置 ====================
  const analysisButtons: AnalysisButtonConfig[] = [
    {
      name: '标记区域分析',
      activeName: '取消区域分析',
      callback: (status: boolean) => {
        console.log('标记区域分析', status);
        const viewer = CesiumUtilsSingleton.getViewer();
        if (!viewer?.canvas) return;
        
        statusStore.cursorStyle = status ? 'crosshair' : 'default';
        viewer.canvas.style.cursor = status ? 'crosshair' : 'default';
        
        if (status) {
          registerMapClickHandler();
        } else {
          removeMapClickHandler();
          clearAllAnalysisResources();
          showAreaDialog.value = false;
        }
      },
    },
    {
      name: '隐藏行政区划',
      callback: (status: boolean) => {
        console.log('隐藏行政区划', status);
        useStatusStore().mapLayers.showAdministrativeDivision.show = !status;
      },
    },
  ];

  return {
    selectedButtonIndex,
    showAreaDialog,
    radius,
    dialogPosition,
    analysisButtons,
    handleButtonClick,
    handleConfirm,
    handleCancel,
    refreshPulseEffect,
  };
};
