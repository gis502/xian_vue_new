import type { WarningList } from '../common/WarningList';

export interface RainPredictResponse {
  record_id: number;
  list: Record<string, WarningList>;
}
