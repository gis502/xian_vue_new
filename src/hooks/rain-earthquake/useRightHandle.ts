import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore';

export const useRightHandle = () => {
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

  return { resetScene, resetView };
};
