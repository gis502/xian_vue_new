import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
import { useStatusStore } from '@/stores/useStatusStore';
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

  /**
   * 点击显示医院
   */
  const clickHospital = (status: unknown) => {
    if (status as boolean) {
      useStatusStore().poiLayers.showHospital.loading = true;
      // 显示医院
      CesiumUtilsSingleton.batchShowPrimitives(
        useLoadingResourceStore().getLoadingResource(LoadingResource.HOSPITAL)
      );
    } else {
      // 隐藏医院
      CesiumUtilsSingleton.batchHidePrimitives(
        useLoadingResourceStore().getLoadingResource(LoadingResource.HOSPITAL)
      );
    }
  };

  return { clickHiddenDangerPoint, clickHospital };
};
