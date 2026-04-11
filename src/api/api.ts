import type { DisasterType } from '@/types/common/DisasterType'
import { getSm2PublicKey } from './crypto'
import { getBasePoins as getHiddenDangerBasePoints, getPointDetailById as getHiddenDangerPointDetailById} from './hidden-danger-spots'
import { getBasePoins as getRiskBasePoints, getPointDetailById as getRiskPointDetailById} from './risk-spots'
import type { ApiResponse } from '@/types/ApiResponse'
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots'
import type { XianRiskSpots } from '@/types/base/XianRiskSpots'

export const $api = {

  // 加密模块
  crypto: {
    // 获取sm2公钥
    getSm2PublicKey: () => getSm2PublicKey(),
  },

  // 隐患点信息
  hiddenDangerSpots: {
    // 获取所有基础隐患点
    getBasePoins: (disasterType: DisasterType): Promise<ApiResponse<XianHiddenDangerSpots[]>> => getHiddenDangerBasePoints(disasterType),

    // 根据id获取隐患点详情
    getPointDetailById: (id: number): Promise<ApiResponse<XianHiddenDangerSpots>> => getHiddenDangerPointDetailById(id),
  },

  // 风险点信息
  riskSpots: {
    // 获取所有基础风险点
    getBasePoins: (): Promise<ApiResponse<XianRiskSpots[]>> => getRiskBasePoints(),

    // 根据id获取风险点详情
    getPointDetailById: (id: number): Promise<ApiResponse<XianRiskSpots>> => getRiskPointDetailById(id),
  },
}
