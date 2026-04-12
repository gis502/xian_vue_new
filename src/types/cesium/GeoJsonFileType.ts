export interface GeoJsonFileType {
  type: "FeatureCollection";
  features: {
    geometry: {
      coordinates: number[][][][];
    };
  }[];
}