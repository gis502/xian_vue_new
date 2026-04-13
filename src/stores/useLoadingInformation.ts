import type { ClickObject } from '@/types/cesium/ClickObject';
import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * 加载信息弹窗相关状态管理
 * @returns 点击对象、隐患点/风险点状态及相关方法
 */
export const useLoadingInformationStore = defineStore(
  'loadingInformation',
  () => {
    /**
     * 点击的对象
     */
    const clickObject: Ref<ClickObject> = ref({ id: '', primitive: null });

    /**
     * 隐患点加载状态
     */
    const loadingHiddenPointInformationStatus: Ref<boolean> = ref(false);
    /**
     * 隐患点ID
     */
    const hiddenPointId: Ref<number> = ref(-1);

    /**
     * 风险点加载状态
     */
    const loadingRiskPointInformationStatus: Ref<boolean> = ref(false);
    /**
     * 风险点ID
     */
    const riskPointId: Ref<number> = ref(-1);

    /**
     * 重置状态
     */
    const resetStatue = () => {
      loadingHiddenPointInformationStatus.value = false;
      hiddenPointId.value = -1;
      loadingRiskPointInformationStatus.value = false;
      riskPointId.value = -1;
    };

    /**
     * 获取点击对象
     * @returns 点击对象
     */
    const getClickObject = () => clickObject.value;
    /**
     * 设置点击对象
     * @param value - 点击对象
     */
    const setClickObject = (value: ClickObject) => {
      clickObject.value = value;
    };
    /**
     * 获取隐患点加载状态
     * @returns 加载状态
     */
    const getLoadingHiddenPointInformationStatus = () =>
      loadingHiddenPointInformationStatus.value;
    /**
     * 设置隐患点加载状态
     * @param value - 加载状态
     */
    const setLoadingHiddenPointInformationStatus = (value: boolean) => {
      loadingHiddenPointInformationStatus.value = value;
    };
    /**
     * 获取风险点加载状态
     * @returns 加载状态
     */
    const getLoadingRiskPointInformationStatus = () =>
      loadingRiskPointInformationStatus.value;
    /**
     * 设置风险点加载状态
     * @param value - 加载状态
     */
    const setLoadingRiskPointInformationStatus = (value: boolean) => {
      loadingRiskPointInformationStatus.value = value;
    };
    /**
     * 获取隐患点ID
     * @returns 隐患点ID
     */
    const getHiddenPointId = () => hiddenPointId.value;
    /**
     * 设置隐患点ID
     * @param value - 隐患点ID
     */
    const setHiddenPointId = (value: number) => {
      hiddenPointId.value = value;
    };
    /**
     * 获取风险点ID
     * @returns 风险点ID
     */
    const getRiskPointId = () => riskPointId.value;
    /**
     * 设置风险点ID
     * @param value - 风险点ID
     */
    const setRiskPointId = (value: number) => {
      riskPointId.value = value;
    };

    return {
      resetStatue,
      getClickObject,
      setClickObject,
      getLoadingHiddenPointInformationStatus,
      setLoadingHiddenPointInformationStatus,
      getLoadingRiskPointInformationStatus,
      setLoadingRiskPointInformationStatus,
      getHiddenPointId,
      setHiddenPointId,
      getRiskPointId,
      setRiskPointId,
    };
  }
);
