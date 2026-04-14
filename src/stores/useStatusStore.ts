import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * 全局状态管理
 * @returns 应用状态及相关方法
 */
export const useStatusStore = defineStore('status', () => {
  /**
   * 应用加载完成状态
   */
  const appLoadingCompleted: Ref<boolean> = ref(false);

  /**
   * 显示行政区划
   */
  const showAdministrativeDivision = ref(true);

  /**
   * 灾情链影响点表格显示状态
   */
  const disasterChainPointShow = ref(false);

  /**
   * 图例显示状态
   */
  const legendShow = ref(true);

  /**
   * 隐患点显示状态
   */
  const hiddenDangerPointShow = ref(true);

  /**
   * 风险点显示状态
   */
  const riskPointShow = ref(true);

  /**
   * 获取应用加载完成状态
   * @returns 加载完成状态
   */
  const getAppLoadingCompleted = () => appLoadingCompleted.value;
  /**
   * 设置应用加载完成状态
   * @param value - 加载完成状态
   */
  const setAppLoadingCompleted = (value: boolean) => {
    appLoadingCompleted.value = value;
  };

  /**
   * 获取显示行政区划
   * @returns 显示行政区划
   */
  const getShowAdministrativeDivision = () => showAdministrativeDivision.value;
  /**
   * 设置显示行政区划
   * @param value - 显示行政区划
   */
  const setShowAdministrativeDivision = (value: boolean) => {
    showAdministrativeDivision.value = value;
  };

  /**
   * 获取灾情链影响点表格显示状态
   * @returns 灾情链影像点表格显示状态
   */
  const getDisasterChainPointShow = () => disasterChainPointShow.value;
  /**
   * 设置灾情链影响点表格显示状态
   * @param value - 灾情链影像点表格显示状态
   */
  const setDisasterChainPointShow = (value: boolean) => {
    disasterChainPointShow.value = value;
  };

  /**
   * 获取图例显示状态
   * @returns 图例显示状态
   */
  const getLegendShow = () => legendShow.value;
  /**
   * 设置图例显示状态
   * @param value - 图例显示状态
   */
  const setLegendShow = (value: boolean) => {
    legendShow.value = value;
  };

  /**
   * 获取隐患点显示状态
   * @returns 隐患点显示状态
   */
  const getHiddenDangerPointShow = () => hiddenDangerPointShow.value;
  /**
   * 设置隐患点显示状态
   * @param value - 隐患点显示状态
   */
  const setHiddenDangerPointShow = (value: boolean) => {
    hiddenDangerPointShow.value = value;
  };

  /**
   * 获取风险点显示状态
   * @returns 风险点显示状态
   */
  const getRiskPointShow = () => riskPointShow.value;
  /**
   * 设置风险点显示状态
   * @param value - 风险点显示状态
   */
  const setRiskPointShow = (value: boolean) => {
    riskPointShow.value = value;
  };

  return {
    getAppLoadingCompleted,
    setAppLoadingCompleted,
    getShowAdministrativeDivision,
    setShowAdministrativeDivision,
    getDisasterChainPointShow,
    setDisasterChainPointShow,
    getLegendShow,
    setLegendShow,
    getHiddenDangerPointShow,
    setHiddenDangerPointShow,
    getRiskPointShow,
    setRiskPointShow,
  };
});
