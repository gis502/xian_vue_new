import { Billboard } from 'cesium'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

/**
 * 加载信息弹窗相关参数
 */
export const useLoadingInformationStore = defineStore('loadingInformation', () => {

    // 点击的对象
    const clickObject: Ref<{ primitive: Billboard | null }> = ref({ primitive: null })

    // 隐患点
    const loadingHiddenPointInformationStatus: Ref<boolean> = ref(false)
    const hiddenPointId: Ref<number> = ref(-1)

    // 风险点
    const loadingRiskPointInformationStatus: Ref<boolean> = ref(false)
    const riskPointId: Ref<number> = ref(-1)

    // 重置状态
    const resetStatue = () => {
        loadingHiddenPointInformationStatus.value = false
        hiddenPointId.value = -1
        loadingRiskPointInformationStatus.value = false
        riskPointId.value = -1
    }

    // get/set方法
    const getClickObject = () => clickObject.value
    const setClickObject = (value: {primitive: Billboard}) => {
        clickObject.value = value
    }
    const getLoadingHiddenPointInformationStatus = () => loadingHiddenPointInformationStatus.value
    const setLoadingHiddenPointInformationStatus = (value: boolean) => {
        loadingHiddenPointInformationStatus.value = value
    }
    const getLoadingRiskPointInformationStatus = () => loadingRiskPointInformationStatus.value
    const setLoadingRiskPointInformationStatus = (value: boolean) => {
        loadingRiskPointInformationStatus.value = value
    }
    const getHiddenPointId = () => hiddenPointId.value
    const setHiddenPointId = (value: number) => {
        hiddenPointId.value = value
    }
    const getRiskPointId = () => riskPointId.value
    const setRiskPointId = (value: number) => {
        riskPointId.value = value
    }

    return { resetStatue, getClickObject, setClickObject, getLoadingHiddenPointInformationStatus, setLoadingHiddenPointInformationStatus, getLoadingRiskPointInformationStatus, setLoadingRiskPointInformationStatus, getHiddenPointId, setHiddenPointId, getRiskPointId, setRiskPointId }
})
