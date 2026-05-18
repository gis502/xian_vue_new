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

  const nextStep = () => {
    currentStep.value =
      currentStep.value >= stepList.value.length ? 0 : currentStep.value + 1;
  };

  return { stepList, currentStep, nextStep };
});
