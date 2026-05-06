import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/**
 * 左侧图例信息
 */
export const useLeftLegendStore = defineStore('leftLegend', () => {
  const legendListInfo: Ref<
    Record<
      string,
      {
        title: string;
        list: { label: string; color: string }[];
      }
    >
  > = ref({});

  /**
   * 重置左侧图例信息
   */
  const resetLegendListInfo = () => {
    legendListInfo.value = {};
  };
  return { legendListInfo, resetLegendListInfo };
});
