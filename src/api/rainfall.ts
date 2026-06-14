import type { ApiResponse } from '@/types/ApiResponse';
import type { RainPredictRequest } from '@/types/rainstorm/RainPredictRequest';
import type { RainPredictResponse } from '@/types/rainstorm/RainPredictResponse';
import httpInstance from '@/utils/request/http';

/**
 * 进行模型推演
 * @param req 请求体
 * @returns 推演点的概率
 */
export const modelDeduction = (
  req: RainPredictRequest
): Promise<ApiResponse<RainPredictResponse>> => {
  return httpInstance.post('/algorithm-api/rainfall/predict', req);
};
