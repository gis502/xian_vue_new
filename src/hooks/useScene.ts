import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore';
import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
import { useStatusStore } from '@/stores/useStatusStore';

export const useScene = () => {
  const statusStore = useStatusStore();
  const loadingInformationStore = useLoadingInformationStore();
  const leftLegendStore = useLeftLegendStore();
  const buttonSelectedIdStore = useButtonSelectedIdStore();

  // 重置场景
  const resetScene = () => {
    // 重置所有状态
    statusStore.reset();

    // 重置状态
    loadingInformationStore.resetStatue();

    // 重置按钮
    buttonSelectedIdStore.resetId();

    // 重置左侧图例
    leftLegendStore.resetLegendListInfo();
  };

  return { resetScene };
};
