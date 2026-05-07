import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useScene } from '../useScene';
import { useRainstormDeduction } from '../rainstorm/useRainstormDeduction';

export const useRightHandle = () => {
  /**
   * 暴雨模拟
   * @param status - 状态
   */
  const rainstormSimulation = (status: unknown) => {
    if (status as boolean) {
      // 显示步骤
      useRainstormDeduction().showStep();

      // 开启暴雨模拟：显示降雨栅格图层
      useStatusStore().weatherLayers.showRainfallGrid.loading = true;
      useStatusStore().weatherLayers.showRainfallGrid.show = true;

      // 添加图例
      useRainstormDeduction().addLegend();
    } else {
      // 关闭暴雨模拟：隐藏降雨栅格图层
      useStatusStore().weatherLayers.showRainfallGrid.show = false;

      // 删除图例
      delete useLeftLegendStore().legendListInfo.precipitation;

      // 隐藏步骤条
      useStatusStore().uiComponents.stepBar.show = false;
    }
  };

  /**
   * 重置场景
   */
  const resetScene = () => {
    CesiumUtilsSingleton.clearAllResources('custom');
    useScene().resetScene();
    // 隐藏加载
    useStatusStore().appLoadingCompleted = true;
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
