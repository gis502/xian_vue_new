import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore';
import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
import { useStatusStore } from '@/stores/useStatusStore';

export const useScene = () => {
  // 重置场景
  const resetScene = () => {
    // 重置所有状态
    useStatusStore().reset();

    // 重置状态
    useLoadingInformationStore().resetStatue();

    // 重置按钮
    useButtonSelectedIdStore().resetId();

    // 重置左侧图例
    useLeftLegendStore().resetLegendListInfo();
  };

  return { resetScene };
};
