import type { ApiResponse } from "@/types/ApiResponse"
import type { XianRiskSpots } from "@/types/base/XianRiskSpots"
import httpInstance from "@/utils/request/http"

/**
 * 获取风险点基础数据
 * @returns 风险点数据数组
 */
export const getBasePoins = (): Promise<ApiResponse<XianRiskSpots[]>> => {
    return httpInstance.get('/risk-spots/base-points')
}

/**
 * 根据id获取风险点详情
 * @param id - 风险点id
 * @returns 风险点详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianRiskSpots>> => {
    return httpInstance.get(`/risk-spots/point-detail/${id}`)
}