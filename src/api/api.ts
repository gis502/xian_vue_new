import type { DisasterType } from '@/types/common/DisasterType.ts'
import { getSm2PublicKey } from './crypto'
import { getBasePoins as getHiddenDangerBasePoints, getPointDetailById as getHiddenDangerPointDetailById} from './hidden-danger-spots'
import { getBasePoins as getRiskBasePoints, getPointDetailById as getRiskPointDetailById} from './risk-spots'
import type { ApiResponse } from '@/types/ApiResponse'
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots'
import type { XianRiskSpots } from '@/types/base/XianRiskSpots'

/**
 * API接口统一导出对象
 */
export const $api = {

  // 加密模块
  crypto: {
    /**
     * 获取SM2公钥
     * @returns SM2公钥响应
     */
    getSm2PublicKey: () => getSm2PublicKey(),
  },

  // 隐患点信息
  hiddenDangerSpots: {
    /**
     * 获取所有基础隐患点
     * @param disasterType - 灾害类型
     * @returns 隐患点数据数组
     */
    getBasePoins: (disasterType: DisasterType): Promise<ApiResponse<XianHiddenDangerSpots[]>> => getHiddenDangerBasePoints(disasterType),

    /**
     * 根据id获取隐患点详情
     * @param id - 隐患点id
     * @returns 隐患点详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianHiddenDangerSpots>> => getHiddenDangerPointDetailById(id),
  },

  // 风险点信息
  riskSpots: {
    /**
     * 获取所有基础风险点
     * @returns 风险点数据数组
     */
    getBasePoins: (): Promise<ApiResponse<XianRiskSpots[]>> => getRiskBasePoints(),

    /**
     * 根据id获取风险点详情
     * @param id - 风险点id
     * @returns 风险点详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianRiskSpots>> => getRiskPointDetailById(id),
  },
}
