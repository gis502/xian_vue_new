import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useScene } from '../useScene';
import { useRainstormDeduction } from '../rainstorm/useRainstormDeduction';

export const useRightHandle = () => {
  const statusStore = useStatusStore();
  const leftLegendStore = useLeftLegendStore();
  const scene = useScene();
  const rainstormDeduction = useRainstormDeduction();
  /**
   * 暴雨模拟
   * @param status - 状态
   */
  const rainstormSimulation = (status: unknown) => {
    if (status as boolean) {
      // 显示步骤
      rainstormDeduction.showStep();

      // 开启暴雨模拟：显示降雨栅格图层
      statusStore.weatherLayers.showRainfallGrid.loading = true;
      statusStore.weatherLayers.showRainfallGrid.show = true;

      // 添加图例
      rainstormDeduction.addLegend();
    } else {
      // 关闭暴雨模拟：隐藏降雨栅格图层
      statusStore.weatherLayers.showRainfallGrid.show = false;

      // 删除图例
      delete leftLegendStore.legendListInfo.precipitation;

      // 隐藏步骤条
      statusStore.uiComponents.stepBar.show = false;
    }
  };

  /**
   * 重置场景
   */
  const resetScene = () => {
    CesiumUtilsSingleton.clearAllResources('custom');
    scene.resetScene();
    // 隐藏加载
    statusStore.appLoadingCompleted = true;
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
