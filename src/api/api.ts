import type { DisasterType } from '@/types/common/DisasterType.ts'
import { getSm2PublicKey } from './crypto'
import { getBasePoins as getHiddenDangerBasePoints, getPointDetailById as getHiddenDangerPointDetailById} from './hidden-danger-spots'
import { getBasePoins as getRiskBasePoints, getPointDetailById as getRiskPointDetailById} from './risk-spots'
import { getBasePoints as getHospitalsBasePoints, getPointDetailById as getHospitalsPointDetailById} from './hospitals'
import { getBasePoints as getDangerousSourceBasePoints, getPointDetailById as getDangerousSourcePointDetailById} from './dangerous-source'
import { getBasePoints as getEmergencyShelterBasePoints, getPointDetailById as getEmergencyShelterPointDetailById} from './emergency-shelter'
import { getBasePoints as getFirefighterBasePoints, getPointDetailById as getFirefighterPointDetailById} from './firefighter'
import { getBasePoints as getStorePointsBasePoints, getPointDetailById as getStorePointsPointDetailById} from './store-points'
import { getBasePoints as getSchoolsBasePoints, getPointDetailById as getSchoolsPointDetailById} from './schools'
import { getBasePoints as getBridgesBasePoints, getPointDetailById as getBridgesPointDetailById} from './bridges'
import { getBasePoints as getReservoirsBasePoints, getPointDetailById as getReservoirsPointDetailById} from './reservoirs'
import { getBasePoints as getSubwayStationsBasePoints, getPointDetailById as getSubwayStationsPointDetailById} from './subway-stations'
import type { ApiResponse } from '@/types/ApiResponse'
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots'
import type { XianRiskSpots } from '@/types/base/XianRiskSpots'
import type { XianHospitals } from '@/types/base/XianHospitals'
import type { XianDangerousSource } from '@/types/base/XianDangerousSource'
import type { XianEmergencyShelter } from '@/types/base/XianEmergencyShelter'
import type { XianFirefighter } from '@/types/base/XianFirefighter'
import type { XianStorePoints } from '@/types/base/XianStorePoints'
import type { XianSchool } from '@/types/base/XianSchool'
import type { XianBridge } from '@/types/base/XianBridge.ts';
import type { XianReservoirList } from '@/types/base/XianReservoirList';
import type { XianSubwayStations } from '@/types/base/XianSubwayStations';

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

  // 医院信息
  hospitals: {
    /**
     * 获取所有基础医院
     * @returns 医院数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianHospitals[]>> => getHospitalsBasePoints(),

    /**
     * 根据id获取医院详情
     * @param id - 医院id
     * @returns 医院详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianHospitals>> => getHospitalsPointDetailById(id),
  },

  // 危险源信息
  dangerousSource: {
    /**
     * 获取所有基础危险源
     * @returns 危险源数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianDangerousSource[]>> => getDangerousSourceBasePoints(),

    /**
     * 根据id获取危险源详情
     * @param id - 危险源id
     * @returns 危险源详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianDangerousSource>> => getDangerousSourcePointDetailById(id),
  },

  // 避难所信息
  emergencyShelter: {
    /**
     * 获取所有基础避难所
     * @returns 避难所数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianEmergencyShelter[]>> => getEmergencyShelterBasePoints(),

    /**
     * 根据id获取避难所详情
     * @param id - 避难所id
     * @returns 避难所详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianEmergencyShelter>> => getEmergencyShelterPointDetailById(id),
  },

  // 消防站信息
  firefighter: {
    /**
     * 获取所有基础消防站
     * @returns 消防站数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianFirefighter[]>> => getFirefighterBasePoints(),

    /**
     * 根据id获取消防站详情
     * @param id - 消防站id
     * @returns 消防站详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianFirefighter>> => getFirefighterPointDetailById(id),
  },

  // 物资储备点信息
  storePoints: {
    /**
     * 获取所有基础物资储备点
     * @returns 物资储备点数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianStorePoints[]>> => getStorePointsBasePoints(),

    /**
     * 根据id获取物资储备点详情
     * @param id - 物资储备点id
     * @returns 物资储备点详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianStorePoints>> => getStorePointsPointDetailById(id),
  },

  // 学校信息
  schools: {
    /**
     * 获取所有基础学校
     * @returns 学校数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianSchool[]>> => getSchoolsBasePoints(),

    /**
     * 根据id获取学校详情
     * @param id - 学校id
     * @returns 学校详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianSchool>> => getSchoolsPointDetailById(id),
  },

  // 桥梁信息
  bridges: {
    /**
     * 获取所有基础桥梁
     * @returns 桥梁数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianBridge[]>> => getBridgesBasePoints(),

    /**
     * 根据id获取桥梁详情
     * @param id - 桥梁id
     * @returns 桥梁详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianBridge>> => getBridgesPointDetailById(id),
  },

  // 水库信息
  reservoirs: {
    /**
     * 获取所有基础水库
     * @returns 水库数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianReservoirList[]>> => getReservoirsBasePoints(),

    /**
     * 根据id获取水库详情
     * @param id - 水库id
     * @returns 水库详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianReservoirList>> => getReservoirsPointDetailById(id),
  },

  // 地铁站点信息
  subwayStations: {
    /**
     * 获取所有基础地铁站点
     * @returns 地铁站点数据数组
     */
    getBasePoints: (): Promise<ApiResponse<XianSubwayStations[]>> => getSubwayStationsBasePoints(),

    /**
     * 根据id获取地铁站点详情
     * @param id - 地铁站点id
     * @returns 地铁站点详情
     */
    getPointDetailById: (id: number): Promise<ApiResponse<XianSubwayStations>> => getSubwayStationsPointDetailById(id),
  },
}
