import { Cartesian3, Color, HeightReference } from 'cesium';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import type { CircleAnalysisOptions } from '@/types/cesium/EntityOptions';

/**
 * 圆形区域绘制管理 Hook
 * @returns 圆形绘制相关方法
 */
export const useCircleDrawer = () => {
  /**
   * 绘制圆形区域
   * @param centerPosition - 中心点位置
   * @param radiusKm - 半径（公里）
   * @param options - 可选配置
   */
  const drawCircle = (
    centerPosition: Cartesian3, 
    radiusKm: number,
    options?: Partial<CircleAnalysisOptions>
  ): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer) return;

    const radiusMeters = radiusKm * 1000;
    
    // 默认配置
    const fillColor = options?.fillColor || Color.RED;
    const fillAlpha = options?.fillAlpha ?? 0.1;
    const outlineColor = options?.outlineColor || Color.RED;
    const outlineAlpha = options?.outlineAlpha ?? 0.9;
    const outlineWidth = options?.outlineWidth ?? 3;
    const height = options?.height ?? 0;
    const heightReference = options?.heightReference ?? HeightReference.CLAMP_TO_GROUND;

    const circleConfig = {
      position: centerPosition,
      ellipse: {
        semiMajorAxis: radiusMeters,
        semiMinorAxis: radiusMeters,
        height,
        heightReference,
      },
    };
    
    const circleFillEntity = viewer.entities.add({
      ...circleConfig,
      ellipse: {
        ...circleConfig.ellipse,
        material: fillColor.withAlpha(fillAlpha),
      },
    });

    const circleOutlineEntity = viewer.entities.add({
      ...circleConfig,
      ellipse: {
        ...circleConfig.ellipse,
        material: Color.TRANSPARENT,
        outline: true,
        outlineColor: outlineColor.withAlpha(outlineAlpha),
        outlineWidth,
      },
    });

    circleFillEntity ._isAnalysisCircle = true;
    circleOutlineEntity._isAnalysisCircle = true;

    console.log(`已添加圆形图层, 半径: ${radiusKm}公里`);
  };

  /**
   * 清除所有圆形区域
   */
  const clearCircle = (): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer) return;

    viewer.entities.values
      .filter(entity => entity._isAnalysisCircle)
      .forEach(entity => viewer.entities.remove(entity));
  };

  return {
    drawCircle,
    clearCircle,
  };
};
