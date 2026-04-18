import type { ApiResponse } from "@/types/ApiResponse"
import type { XianStorePoints } from "@/types/base/XianStorePoints"
import httpInstance from "@/utils/request/http"

/**
 * 获取物资储备点基础数据
 * @returns 物资储备点数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianStorePoints[]>> => {
    return httpInstance.get('/store-points/base-points')
}

/**
 * 根据id获取物资储备点详情
 * @param id - 物资储备点id
 * @returns 物资储备点详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianStorePoints>> => {
    return httpInstance.get(`/store-points/point-detail/${id}`)
}
