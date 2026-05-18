export interface RainfallGridResponse {
  id: number;
  pngPath: string;
  queryTime?: string;
  resolution?: number;
  stationCount?: number;
  cesiumConfig?: {
    rectangle: {
      west: number;
      south: number;
      east: number;
      north: number;
    };
    width?: number;
    height?: number;
  };
}
