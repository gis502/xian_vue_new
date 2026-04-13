import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

export const useViewerStore = defineStore('viewer', () => {
  // viewer完成状态
  const viewerLoadingCompleted: Ref<boolean> = ref(false);

  // get/set方法
  const getViewerLoadingCompleted = () => viewerLoadingCompleted.value;
  const setViewerLoadingCompleted = (value: boolean) => {
    viewerLoadingCompleted.value = value;
  };

  return { getViewerLoadingCompleted, setViewerLoadingCompleted };
});
