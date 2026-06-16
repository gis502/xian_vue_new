import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * 模拟暴雨、地震灾害链id
 */
export const useSimulationIdStore = defineStore('simulationId', () => {
  const status: Ref<boolean> = ref(false);
  const id: Ref<number> = ref(-1);

  /**
   * 重置模拟id
   */
  const resetSimulationId = () => {
    status.value = false;
    id.value = -1;
  };

  /**
   * 设置id
   */
  const setId = (value: number) => {
    status.value = true;
    id.value = value;
  };

  return { id, status, resetSimulationId, setId };
});
