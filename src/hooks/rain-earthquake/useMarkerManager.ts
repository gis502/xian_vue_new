import { Cartesian3, Entity, VerticalOrigin, HorizontalOrigin, HeightReference } from 'cesium';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

// 十字准心标记 SVG
const MARKER_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="6" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/>
    <path d="M 15 20 L 15 15 L 20 15" stroke="#00FF00" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 65 20 L 65 15 L 60 15" stroke="#00FF00" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 15 60 L 15 65 L 20 65" stroke="#00FF00" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 65 60 L 65 65 L 60 65" stroke="#00FF00" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>
`;

/**
 * 标记管理 Hook
 * @returns 标记相关方法
 */
export const useMarkerManager = () => {
  let currentMarkerEntity: Entity | null = null;

  /**
   * 添加标记
   * @param position - 标记位置
   */
  const addMarker = (position: Cartesian3): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer) return;

    // 移除旧标记
    if (currentMarkerEntity) {
      viewer.entities.remove(currentMarkerEntity);
    }

    const markerDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(MARKER_SVG)}`;
    currentMarkerEntity = viewer.entities.add({
      position,
      billboard: {
        image: markerDataUrl,
        scale: 1.0,
        verticalOrigin: VerticalOrigin.CENTER,
        horizontalOrigin: HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: HeightReference.CLAMP_TO_GROUND,
      },
    });
  };

  /**
   * 移除标记
   */
  const removeMarker = (): void => {
    const viewer = CesiumUtilsSingleton.getViewer();
    if (!viewer || !currentMarkerEntity) return;

    viewer.entities.remove(currentMarkerEntity);
    currentMarkerEntity = null;
  };

  /**
   * 获取当前标记实体
   */
  const getCurrentMarker = (): Entity | null => {
    return currentMarkerEntity;
  };

  return {
    addMarker,
    removeMarker,
    getCurrentMarker,
  };
};
