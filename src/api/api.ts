import type { DisasterType } from '@/types/common/DisasterType'
import { getSm2PublicKey } from './crypto'
import { getBasePoins, getPointDetailById } from './hidden-danger-spots'
import type { ApiResponse } from '@/types/ApiResponse'
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots'

export const $api = {

  // 加密模块
  crypto: {
    // 获取sm2公钥
    getSm2PublicKey: () => getSm2PublicKey(),
  },

  // 隐患点信息
  hiddenDangerSpots: {
    // 获取所有基础隐患点
    getBasePoins: (disasterType: DisasterType): Promise<ApiResponse<XianHiddenDangerSpots[]>> => getBasePoins(disasterType),

    // 根据id获取隐患点详情
    getPointDetailById: (id: number): Promise<ApiResponse<XianHiddenDangerSpots>> => getPointDetailById(id),
  },
}
