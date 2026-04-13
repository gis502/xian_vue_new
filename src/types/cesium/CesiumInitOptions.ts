import type { Color } from 'cesium';
import type { GeoJsonFileType } from './GeoJsonFileType';

/**
 * Cesium 公共配置选项
 * 用于初始化时统一配置 Viewer 参数
 */
export interface CesiumInitOptions {
  containerId: string; // 容器 DOM ID
  terrain?: string; // 地形服务地址（默认：Cesium 内置地形）

  shouldAnimate?: boolean; // 是否自动播放动画(默认：true)
  baseLayerPicker?: boolean; // 是否显示图层选择器（默认：false）
  timeline?: boolean; // 是否显示时间轴（默认：false）
  animation?: boolean; // 是否显示动画控件（默认：false）
  infoBox?: boolean; // 是否显示信息框（默认：false）
  navigationHelpButton?: boolean; // 是否显示导航帮助按钮（默认：false）
  fullscreenButton?: boolean; // 是否显示全屏按钮（默认：false）
  homeButton?: boolean; // 是否显示主页按钮（默认：false）
  scene3DOnly?: boolean; // 是否3D场景（默认：false）
  sceneModePicker?: boolean; // 场景模式选择器（默认：false）
  geocoder?: boolean; // 搜索（默认：false）

  sceneMode?: number; // 初始场景模式（默认：3D，可选：2D=1, COLUMBUS_VIEW=2）

  // 遮罩配置
  mark?: {
    // 是否包含遮罩，默认false
    include?: boolean;
    // GeoJSON 数据，如果要突出显示某一区域，就传递改值
    geoJson?: GeoJsonFileType;
    // 孔属于半球，默认东半球
    belongingHemisphere?: 'east' | 'west';
    // 遮罩颜色，默认黑色
    color?: Color;
    // 边框
    border?: {
      // 是否显示边框，默认true
      show?: boolean;
      // 边框颜色，默认白色
      color?: Color;
      // 边框宽度，默认1
      width?: number;
    };
  };
}
