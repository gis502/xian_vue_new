import { useStatusStore } from '@/stores/useStatusStore.ts';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
import config from '@/config/config.json';
import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useScene } from '../useScene';

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

      // 添加图例
      useLeftLegendStore().legendListInfo.precipitation = {
        title: '降雨量图例',
        list: [
          {
            label: '无雨/微雨; <0.1mm/12h',
            color: 'rgba(200,200,200,0)',
          },
          {
            label: '小雨；<5mm/12h',
            color: 'rgba(0,0,255,0.4)',
          },
          {
            label: '中雨； <15mm/12h',
            color: 'rgba(0,255,255,0.5)',
          },
          {
            label: '大雨； <30mm/12h',
            color: 'rgba(0,255,0,0.6)',
          },
          {
            label: '暴雨； <70mm/12h',
            color: 'rgba(255,255,0,0.7)',
          },
          {
            label: '大暴雨； <140mm/12h',
            color: 'rgba(255,165,0,0.8)',
          },
          {
            label: '特大暴雨； >140mm/12h',
            color: 'rgba(255,0,0,0.9)',
          },
        ],
      };
    } else {
      // 关闭暴雨模拟：隐藏降雨栅格图层
      useStatusStore().weatherLayers.showRainfallGrid.show = false;

      // 删除图例
      delete useLeftLegendStore().legendListInfo.precipitation;
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
