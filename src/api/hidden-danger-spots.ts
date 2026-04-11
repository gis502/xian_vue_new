import type { ApiResponse } from "@/types/ApiResponse"
import type { XianHiddenDangerSpots } from "@/types/base/XianHiddenDangerSpots"
import type { DisasterType } from "@/types/common/DisasterType"
import httpInstance from "@/utils/request/http"

/**
 * 获取隐藏危险点数据
 * @param disasterType 灾害类型
 * @returns 隐患点数据
 */
export const getBasePoins = (disasterType: DisasterType): Promise<ApiResponse<XianHiddenDangerSpots[]>> => {
    return httpInstance.get('/hidden-danger-spots/base-points', {
        params: {
            disasterType
        }
    })
}

/**
 * 根据id获取隐患点详情
 * @param id 隐藏危险点id
 * @returns 隐患点详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianHiddenDangerSpots>> => {
    return httpInstance.get(`/hidden-danger-spots/point-detail/${id}`)
}