import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore';
import { $api } from '@/api/api';

export const useRightHandle = () => {
  /**
   * 暴雨模拟
   * @param status - 状态
   */
  const rainstormSimulation = (status: unknown) => {
    if (status as boolean) {
      // 获取降雨栅格
      $api.meteorology
        .getRainfallGrid({
          startTime: '2025-08-20T00:00:00',
          endTime: '2025-08-20T00:00:00',
        })
        .then((res) => {
          console.log(res);
        });
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
