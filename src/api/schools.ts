import type { ApiResponse } from "@/types/ApiResponse"
import type { XianSchool } from "@/types/base/XianSchool"
import httpInstance from "@/utils/request/http"

/**
 * 获取学校基础数据
 * @returns 学校数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianSchool[]>> => {
    return httpInstance.get('/school/base-points')
}

/**
 * 根据id获取学校详情
 * @param id - 学校id
 * @returns 学校详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianSchool>> => {
    return httpInstance.get(`/school/point-detail/${id}`)
}
