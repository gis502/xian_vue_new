import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
import { LoadingResource } from '@/types/common/LoadingResourceType';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

/**
 * 控制面板显示隐藏逻辑
 */
export const useLayerControl = () => {
  /**
   * 点击显示隐藏隐患点
   * @param status - 显示隐藏状态
   */
  const clickHiddenDangerPoint = (status: unknown) => {
    if (status as boolean) {
      // 显示隐患点
      CesiumUtilsSingleton.batchShowPrimitives(
        useLoadingResourceStore().getLoadingResource(
          LoadingResource.HIDDEN_DANGER_POINT
        )
      );

      // 显示风险点
      CesiumUtilsSingleton.batchShowPrimitives(
        useLoadingResourceStore().getLoadingResource(LoadingResource.RISK_POINT)
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
        useLoadingResourceStore().getLoadingResource(LoadingResource.RISK_POINT)
      );
    }
  };

  return { clickHiddenDangerPoint };
};
