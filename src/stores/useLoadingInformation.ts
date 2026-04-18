import type { ClickObject } from '@/types/cesium/ClickObject';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

/**
 * 加载信息弹窗相关状态管理
 * @returns 点击对象、隐患点/风险点/医院状态及相关方法
 */
export const useLoadingInformationStore = defineStore(
  'loadingInformation',
  () => {
    // ============================ 点击对象状态 ================================

    /**
     * 点击的对象
     */
    const clickObject = reactive<ClickObject>({ id: '', primitive: null });

    // ============================ 隐患点加载状态 ================================

    /**
     * 隐患点加载信息状态
     */
    const hiddenPoint = reactive({
      /** 加载状态 */
      loading: false,
      /** 隐患点ID */
      id: -1,
    });

    // ============================ 风险点加载状态 ================================

    /**
     * 风险点加载信息状态
     */
    const riskPoint = reactive({
      /** 加载状态 */
      loading: false,
      /** 风险点ID */
      id: -1,
    });

    // ============================ 医院加载状态 ================================

    /**
     * 医院加载信息状态
     */
    const hospital = reactive({
      /** 加载状态 */
      loading: false,
      /** 医院ID */
      id: -1,
    });

    // ============================== 危险源加载状态 ================================
    const dangerousSource = reactive({
      /** 加载状态 */
      loading: false,
      /** 危险源ID */
      id: -1,
    });

    // ============================== 避难所状态 ================================
    const emergencyShelter = reactive({
      /** 加载状态 */
      loading: false,
      /** 避难所ID */
      id: -1,
    });

    /**
     * 重置所有状态
     */
    const resetStatue = () => {
      // 点击对象重置
      clickObject.id = '';
      clickObject.primitive = null;

      // 隐患点状态重置
      hiddenPoint.loading = false;
      hiddenPoint.id = -1;

      // 风险点状态重置
      riskPoint.loading = false;
      riskPoint.id = -1;

      // 医院状态重置
      hospital.loading = false;
      hospital.id = -1;

      // 危险源状态重置
      dangerousSource.loading = false;
      dangerousSource.id = -1;

      // 避难所状态重置
      emergencyShelter.loading = false;
      emergencyShelter.id = -1;
    };

    return {
      clickObject,
      hiddenPoint,
      riskPoint,
      hospital,
      dangerousSource,
      emergencyShelter,
      resetStatue,
    };
  }
);
