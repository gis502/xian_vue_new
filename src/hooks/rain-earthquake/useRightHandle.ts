import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore';

export const useRightHandle = () => {
  /**
   * 暴雨模拟
   * @param status - 状态
   */
  const rainstormSimulation = (status: unknown) => {
    if (status as boolean) {
      // 开启暴雨模拟：显示降雨栅格图层
      useStatusStore().weatherLayers.showRainfallGrid.loading = true;
      useStatusStore().weatherLayers.showRainfallGrid.show = true;
    } else {
      // 关闭暴雨模拟：隐藏降雨栅格图层
      useStatusStore().weatherLayers.showRainfallGrid.show = false;
    }
  };

  /**
   * 重置场景
   */
  const resetScene = () => {
    CesiumUtilsSingleton.clearAllResources('custom');
    useStatusStore().resetScene();
    useButtonSelectedIdStore().resetId();
  };

  /**
   * 重置视角
   */
  const resetView = () => {
    CesiumUtilsSingleton.flyToTarget(
      config.defaultPosition as [number, number, number]
    );
  };

  return { rainstormSimulation, resetScene, resetView };
};
