import type {
    Cartesian3,
  Color,
  DataSource,
} from "cesium";
import type { LabelConfig } from "./LabelConfig";

// 数据源：字符串路径/URL | GeoJSON对象
export type CustomizeGeoJsonDataSource = string | object;

// 唯一配置项接口
export interface GeoJsonOptions {
  showName?: boolean;
  isDefault?: boolean;
  labelStyle?: LabelConfig;
  polygonStyle?: {
    fill?: boolean;
    fillColor?: Color;
    outline?: boolean;
    outlineColor?: Color;
    outlineWidth?: number;
    center?: Cartesian3 | [number, number, number];
  };
  polylineStyle?: {
    width?: number;
    material?: Color;
    clampToGround?: boolean;
  };
  pointStyle?: {
    pixelSize?: number;
    color?: Color;
    outlineColor?: Color;
    outlineWidth?: number;
  };
  onComplete?: (dataSource: DataSource) => void;
}