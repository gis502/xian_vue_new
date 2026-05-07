import { useStatusStore } from '@/stores/useStatusStore';

export const useLeftHandle = () => {
  const statusStore = useStatusStore();
  /**
   * 周边分析
   */
  const clickAroundAnalysis = (status: unknown) => {
    // 如果选中，隐藏右侧按钮，取消选中则显示右侧按钮
    if (status as boolean) {
      statusStore.uiComponents.rightButton.show = false;

      // 加载周边分析
      statusStore.functionStatus.aroundAnalysis.loading = true;
      statusStore.functionStatus.aroundAnalysis.show = true;
    } else {
      statusStore.uiComponents.rightButton.show = true;

      // 隐藏周边分析
      statusStore.functionStatus.aroundAnalysis.show = false;
    }
  };
  return {
    clickAroundAnalysis,
  };
};
