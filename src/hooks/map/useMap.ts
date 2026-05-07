import config from '@/config/config.json';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import { ScreenSpaceEventType } from 'cesium';
import type { ClickObject } from '@/types/cesium/ClickObject';
import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
/**
 * 地图交互相关钩子函数
 * @returns 注册监听器和视角控制方法
 */
export const useMap = () => {
  const loadingInfoStore = useLoadingInformationStore();
  /**
   * 注册全局点击监听器
   */
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
          loadingInfoStore.landslideHiddenPoint.id !== id &&
          loadingInfoStore.debrisFlowHiddenPoint.id !== id &&
          loadingInfoStore.waterLoggingHiddenPoint.id !== id &&
          loadingInfoStore.flashFloodHiddenPoint.id !== id &&
          loadingInfoStore.riskPoint.id !== id &&
          loadingInfoStore.hospital.id !== id
        ) {
          loadingInfoStore.resetStatue();
        }

        // 点击对象
        loadingInfoStore.clickObject.id = pickedObject.id;
        loadingInfoStore.clickObject.primitive = pickedObject.primitive;

        // 滑坡隐患点
        if (pickedObject.id.startsWith(config.prefix.landslideHiddenPointId)) {
          loadingInfoStore.landslideHiddenPoint.id = id;
        }

        // 泥石流隐患点
        else if (pickedObject.id.startsWith(config.prefix.debrisFlowHiddenPointId)) {
          loadingInfoStore.debrisFlowHiddenPoint.id = id;
        }

        // 内涝隐患点
        else if (pickedObject.id.startsWith(config.prefix.waterLoggingHiddenPointId)) {
          loadingInfoStore.waterLoggingHiddenPoint.id = id;
        }

        // 山洪隐患点
        else if (pickedObject.id.startsWith(config.prefix.flashFloodHiddenPointId)) {
          loadingInfoStore.flashFloodHiddenPoint.id = id;
        }

        // 风险点
        else if (pickedObject.id.startsWith(config.prefix.riskPointId)) {
          loadingInfoStore.riskPoint.id = id;
        }

        // 医院
        else if (pickedObject.id.startsWith(config.prefix.hospitalPointId)) {
          loadingInfoStore.hospital.id = id;
        }

        // 危险源
        else if (
          pickedObject.id.startsWith(config.prefix.dangerousSourcePointId)
        ) {
          loadingInfoStore.dangerousSource.id = id;
        }

        // 避难所
        else if (
          pickedObject.id.startsWith(config.prefix.emergencyShelterPointId)
        ) {
          loadingInfoStore.emergencyShelter.id = id;
        }

        // 消防站
        else if (pickedObject.id.startsWith(config.prefix.fireStationPointId)) {
          loadingInfoStore.fireStation.id = id;
        }

        // 物资储备点
        else if (pickedObject.id.startsWith(config.prefix.storePointsPointId)) {
          loadingInfoStore.storePoints.id = id;
        }

        // 学校
        else if (pickedObject.id.startsWith(config.prefix.schoolPointId)) {
          loadingInfoStore.school.id = id;
        }

        // 桥梁
        else if (pickedObject.id.startsWith(config.prefix.bridgePointId)) {
          loadingInfoStore.bridge.id = id;
        }

        // 水库
        else if (pickedObject.id.startsWith(config.prefix.reservoirPointId)) {
          loadingInfoStore.reservoir.id = id;
        }

        // 地铁站点
        else if (pickedObject.id.startsWith(config.prefix.subwayStationPointId)) {
          loadingInfoStore.subwayStation.id = id;
        }

        // 其他
        else {
          // 重置状态
          loadingInfoStore.resetStatue();
        }
      } else {
        // 重置状态
        loadingInfoStore.resetStatue();
      }
    });
  };

  /**
   * 注册全局滚轮监听器
   */
  const registerAScrollListener = () => {
    CesiumUtilsSingleton.getViewer()!.scene.canvas.addEventListener(
      'wheel',
      () => {
        // 设置最小最大高度
        CesiumUtilsSingleton.setHeightLimits();
      },
      { passive: true } // 标记为 passive 以提升滚动性能
    );
  };

  /**
   * 当行政区超出页面时，自动拉回视角
   */
  const automaticallyAdjustThePerspective = () => {
    CesiumUtilsSingleton.outOverView();
  };

  /**
   * 禁止默认事件
   */
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
