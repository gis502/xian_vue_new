import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/**
 * 左侧图例信息
 */
export const useLeftLegendStore = defineStore('leftLegend', () => {
  const legendListInfo: Ref<{
    title: string;
    list: { label: string; color: string }[];
  }> = ref({
    title: '',
    list: [],
  });
  return { legendListInfo };
});
