import type { Cartesian3, Color, NearFarScalar } from 'cesium';

export interface PrimitiveOptions {
  id: string;
  type: 'point' | 'polyline' | 'polygon' | 'billboard';
  positions: [number, number, number][] | Cartesian3[]; // 点集合，线和面需要多个点
  isDefault?: boolean; // 是否为默认图元，默认值false
  color?: Color;
  pixelSize?: number; // 点大小
  width?: number; // 线宽
  image?: string; // 广告牌图片
  scale?: number; // 广告牌缩放
  scaleByDistance?: NearFarScalar; // 广告牌距离衰减缩放
  customProperties?: Record<string, unknown>; // 自定义属性对象
}
