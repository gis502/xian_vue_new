import config from '@/config/config.json';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import { ScreenSpaceEventType } from 'cesium';
import type { ClickObject } from '@/types/cesium/ClickObject';
import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
export const useMap = () => {
  // 注册全局点击监听器
  const registerAndClickOnTheListener = () => {
    CesiumUtilsSingleton.clickLayer((pickedObject: ClickObject) => {
      if (
        pickedObject &&
        pickedObject.id &&
        typeof pickedObject.id === 'string'
      ) {
        const matchResult = pickedObject.id.match(/\d+$/);
        const id = matchResult ? parseInt(matchResult[0]) : -1;

        // 当id改变时候，重置状态
        if (
          useLoadingInformationStore().getHiddenPointId() !== id &&
          useLoadingInformationStore().getRiskPointId() !== id
        ) {
          useLoadingInformationStore().resetStatue();
        }

        // 点击对象
        useLoadingInformationStore().setClickObject(pickedObject);

        // 隐患点
        if (pickedObject.id.startsWith(config.prefix.hiddenDangerPointId)) {
          useLoadingInformationStore().setHiddenPointId(id);
        }

        // 风险点
        else if (pickedObject.id.startsWith(config.prefix.riskPointId)) {
          useLoadingInformationStore().setRiskPointId(id);
        } else {
          // 重置状态
          useLoadingInformationStore().resetStatue();
        }
      } else {
        // 重置状态
        useLoadingInformationStore().resetStatue();
      }
    });
  };

  // 注册全局滚轮监听器
  const registerAScrollListener = () => {
    CesiumUtilsSingleton.getViewer()!.scene.canvas.addEventListener(
      'wheel',
      () => {
        // 设置最小最大高度
        CesiumUtilsSingleton.setHeightLimits();
      }
    );
  };

  // 当行政区超出页面时，自动拉回视角
  const automaticallyAdjustThePerspective = () => {
    CesiumUtilsSingleton.outOverView();
  };

  // 禁止事件
  const prohibitedEvents = () => {
    // 禁止全局默认双击事件
    CesiumUtilsSingleton.getViewer()?.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
  };

  return {
    registerAndClickOnTheListener,
    registerAScrollListener,
    automaticallyAdjustThePerspective,
    prohibitedEvents,
  };
};
