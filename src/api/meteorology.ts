import type { ApiResponse } from '@/types/ApiResponse';
import type { RainfallGridRequest } from '@/types/rainstorm/RainfallGridRequest';
import type { RainfallGridResponse } from '@/types/rainstorm/RainfallGridResponse';
import httpInstance from '@/utils/request/http';

/**
 * 获取降雨栅格数据
 * @returns 降雨栅格数据
 */
export const getRainfallGrid = (
  request: RainfallGridRequest
): Promise<ApiResponse<RainfallGridResponse>> => {
  return httpInstance.post('/algorithm-api/rainfall/grid', request);
};
