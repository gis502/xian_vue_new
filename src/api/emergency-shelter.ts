import type { ApiResponse } from "@/types/ApiResponse"
import type { XianEmergencyShelter } from "@/types/base/XianEmergencyShelter"
import httpInstance from "@/utils/request/http"

/**
 * 获取避难所基础数据
 * @returns 避难所数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianEmergencyShelter[]>> => {
    return httpInstance.get('/emergency-shelter/base-points')
}

/**
 * 根据id获取避难所详情
 * @param id - 避难所id
 * @returns 避难所详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianEmergencyShelter>> => {
    return httpInstance.get(`/emergency-shelter/point-detail/${id}`)
}
