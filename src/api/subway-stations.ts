import type { ApiResponse } from "@/types/ApiResponse"
import type { XianSubwayStations } from "@/types/base/XianSubwayStations"
import httpInstance from "@/utils/request/http"

/**
 * 获取地铁站点基础数据
 * @returns 地铁站点数据数组
 */
export const getBasePoints = (): Promise<ApiResponse<XianSubwayStations[]>> => {
    return httpInstance.get('/subway/base-points')
}

/**
 * 根据id获取地铁站点详情
 * @param id - 地铁站点id
 * @returns 地铁站点详情
 */
export const getPointDetailById = (id: number): Promise<ApiResponse<XianSubwayStations>> => {
    return httpInstance.get(`/subway/point-detail/${id}`)
}
