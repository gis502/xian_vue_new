import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * Viewer加载状态管理
 * @returns Viewer加载完成状态及相关方法
 */
export const useViewerStore = defineStore('viewer', () => {
  /**
   * Viewer加载完成状态
   */
  const viewerLoadingCompleted: Ref<boolean> = ref(false);

  /**
   * 获取Viewer加载完成状态
   * @returns 加载完成状态
   */
  const getViewerLoadingCompleted = () => viewerLoadingCompleted.value;
  /**
   * 设置Viewer加载完成状态
   * @param value - 加载完成状态
   */
  const setViewerLoadingCompleted = (value: boolean) => {
    viewerLoadingCompleted.value = value;
  };

  return { getViewerLoadingCompleted, setViewerLoadingCompleted };
});
