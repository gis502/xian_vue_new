import { 
  Cartesian3, 
  Color, 
  Entity, 
  VerticalOrigin, 
  HorizontalOrigin, 
  HeightReference, 
  CallbackProperty, 
  JulianDate 
} from 'cesium';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import type { PointResource } from '@/types/common/useAroundAnalysisType';

/**
 * 脉冲效果管理 Hook
 * @returns 脉冲效果相关方法
 */
export const usePulseEffect = () => {
  let pulseEntities: Entity[] = [];

  /**
   * 创建红色圆形纹理
   * @param radius - 半径
   * @param lineWidth - 线宽
   * @param opacity - 透明度
   * @returns Base64 图片数据
   */
  const createRedCircleTexture = (radius = 15, lineWidth = 2, opacity = 0.8): string => {
    const canvas = document.createElement('canvas');
    const size = radius * 2 + 10;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    return canvas.toDataURL();
  };

  /**
   * 为单个点添加脉冲效果
   * @param point - 点资源
   * @param startTime - 开始时间（秒）
   */
  const addPulseEffectToPoint = (point: PointResource, startTime: number): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer || point.lon === undefined || point.lat === undefined) return;

    const lon = Number(point.lon);
    const lat = Number(point.lat);
    if (isNaN(lon) || isNaN(lat)) return;

    const position = Cartesian3.fromDegrees(lon, lat, 0);
    const baseTexture = createRedCircleTexture(10, 3, 1.0);
    
    const dynamicScale = new CallbackProperty((time: JulianDate) => {
      const elapsed = ((time.secondsOfDay - startTime) % 1 + 1) % 1;
      return 1.1 + 0.2 * Math.sin(elapsed * Math.PI * 2);
    }, false);

    const pulseEntity = viewer.entities.add({
      position,
      billboard: {
        image: baseTexture,
        scale: dynamicScale,
        color: new CallbackProperty((time: JulianDate) => {
          const elapsed = ((time.secondsOfDay - startTime) % 1 + 1) % 1;
          const alpha = 0.6 + 0.4 * Math.sin(elapsed * Math.PI * 2);
          return Color.fromBytes(255, 0, 0, Math.floor(alpha * 255));
        }, false),
        verticalOrigin: VerticalOrigin.CENTER,
        horizontalOrigin: HorizontalOrigin.CENTER,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    pulseEntities.push(pulseEntity);
  };

  /**
   * 为多个点添加脉冲效果
   * @param points - 点资源数组
   */
  const addPulseEffectToPoints = (points: PointResource[]): void => {
    const startTime = JulianDate.now().secondsOfDay;
    points.forEach(point => addPulseEffectToPoint(point, startTime));
    console.log(`已为 ${points.length} 个点添加脉冲效果`);
  };

  /**
   * 移除所有脉冲效果
   */
  const removePulseEffect = (): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer) return;
    
    pulseEntities.forEach(entity => viewer.entities.remove(entity));
    pulseEntities = [];
  };

  /**
   * 获取当前脉冲实体数量
   */
  const getPulseCount = (): number => {
    return pulseEntities.length;
  };

  return {
    addPulseEffectToPoint,
    addPulseEffectToPoints,
    removePulseEffect,
    getPulseCount,
  };
};
