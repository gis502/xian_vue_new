import type { Billboard } from 'cesium';

export interface ClickObject {
  id: string;
  [key: string]: unknown;
  primitive: Billboard | null;
}
