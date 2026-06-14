import type { ApiResponse } from '@/types/ApiResponse';
import type { RainPredictResponse } from '@/types/rainstorm/RainPredictResponse';
import httpInstance from '@/utils/request/http';

/**
 * 进行模型推演
 * @param disasterName 灾害名称
 * @returns 推演点的概率
 */
export const modelDeduction = (
  disasterName: string
): Promise<ApiResponse<RainPredictResponse[]>> => {
  return httpInstance.post('/algorithm-api/rainfall/predict', {
    disaster_name: disasterName,
  });
};
