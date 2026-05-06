import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * 步骤条store
 */
export const useStepStore = defineStore('step', () => {
  /**
   * 步骤条列表
   */
  const stepList: Ref<string[]> = ref([]);

  /**
   * 当前步骤
   */
  const currentStep: Ref<number> = ref(0);

  return { stepList, currentStep };
});
