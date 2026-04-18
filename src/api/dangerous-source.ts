import type { ApiResponse } from "@/types/ApiResponse"
import type { XianDangerousSource } from "@/types/base/XianDangerousSource"
import httpInstance from "@/utils/request/http"

/**
 * 获取危险源基础数据
 * @returns 危险源数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianDangerousSource[]>> => {
    return httpInstance.get('/dangerous-source/base-points')
}

/**
 * 根据id获取危险源详情
 * @param id - 危险源id
 * @returns 危险源详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianDangerousSource>> => {
    return httpInstance.get(`/dangerous-source/point-detail/${id}`)
}
