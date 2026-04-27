import type { ApiResponse } from "@/types/ApiResponse"
import type { XianReservoirList } from "@/types/base/XianReservoirList"
import httpInstance from "@/utils/request/http"

/**
 * 获取水库基础数据
 * @returns 水库数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianReservoirList[]>> => {
    return httpInstance.get('/reservoir/base-points')
}

/**
 * 根据id获取水库详情
 * @param id - 水库id
 * @returns 水库详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianReservoirList>> => {
    return httpInstance.get(`/reservoir/point-detail/${id}`)
}
