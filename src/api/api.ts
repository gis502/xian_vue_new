import { getSm2PublicKey } from './crypto'

export const $api = {

  // 加密模块
  crypto: {
    // 获取sm2公钥
    getSm2PublicKey: () => getSm2PublicKey(),
  },
}
