import { useStatusStore } from '@/stores/useStatusStore';

export const useLeftHandle = () => {
  /**
   * 周边分析
   */
  const clickAroundAnalysis = (status: unknown) => {
    // 如果选中，隐藏右侧按钮，取消选中则显示右侧按钮
    if (status as boolean) {
      useStatusStore().uiComponents.rightButton.show = false;

      // 加载周边分析
      useStatusStore().functionStatus.aroundAnalysis.loading = true;
      useStatusStore().functionStatus.aroundAnalysis.show = true;
    } else {
      useStatusStore().uiComponents.rightButton.show = true;

      // 隐藏周边分析
      useStatusStore().functionStatus.aroundAnalysis.show = false;
    }
  };
  return {
    clickAroundAnalysis,
  };
};
