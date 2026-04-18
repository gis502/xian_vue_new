import { useStatusStore } from '@/stores/useStatusStore';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import config from '@/config/config.json';

export const useRightHandle = () => {
  /**
   * 重置场景
   */
  const resetScene = () => {
    CesiumUtilsSingleton.clearAllResources('custom');
    useStatusStore().resetScene();
  };

  /**
   * 重置视角
   */
  const resetView = () => {
    CesiumUtilsSingleton.flyToTarget(
      config.defaultPosition as [number, number, number]
    );
  };

  return { resetScene, resetView };
};
