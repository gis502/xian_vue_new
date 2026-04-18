import type { ApiResponse } from "@/types/ApiResponse"
import type { XianFirefighter } from "@/types/base/XianFirefighter"
import httpInstance from "@/utils/request/http"

/**
 * 获取消防站基础数据
 * @returns 消防站数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianFirefighter[]>> => {
    return httpInstance.get('/firefighter/base-points')
}

/**
 * 根据id获取消防站详情
 * @param id - 消防站id
 * @returns 消防站详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianFirefighter>> => {
    return httpInstance.get(`/firefighter/point-detail/${id}`)
}
