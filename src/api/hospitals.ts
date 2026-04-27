import type { ApiResponse } from "@/types/ApiResponse"
import type { XianHospitals } from "@/types/base/XianHospitals"
import httpInstance from "@/utils/request/http"

/**
 * 获取医院基础数据
 * @returns 医院数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianHospitals[]>> => {
    return httpInstance.get('/hospitals/base-points')
}

/**
 * 根据id获取医院详情
 * @param id - 医院id
 * @returns 医院详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianHospitals>> => {
    return httpInstance.get(`/hospitals/point-detail/${id}`)
}
