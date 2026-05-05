export interface RainfallFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    rainfall: number;
    color: string;
  };
}

export interface RainfallGridResponse {
  type: 'FeatureCollection';
  features: RainfallFeature[];
  metadata: {
    resolution: number;
    grid_size: number[];
    bounds: {
      min_lon: number;
      max_lon: number;
      min_lat: number;
      max_lat: number;
    };
  };
}
