import type { ApiResponse } from "@/types/ApiResponse"
import type { XianBridge } from "@/types/base/XianBridge"
import httpInstance from "@/utils/request/http"

/**
 * 获取桥梁基础数据
 * @returns 桥梁数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianBridge[]>> => {
    return httpInstance.get('/bridge/base-points')
}

/**
 * 根据id获取桥梁详情
 * @param id - 桥梁id
 * @returns 桥梁详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianBridge>> => {
    return httpInstance.get(`/bridge/point-detail/${id}`)
}
