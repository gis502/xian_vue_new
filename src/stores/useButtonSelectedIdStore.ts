import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';

/**
 * 选中按钮id记录
 */
export const useButtonSelectedIdStore = defineStore('buttonSelectedId', () => {
  /**
   * 左侧按钮选中id
   */
  const leftButtonSelectedId: Ref<number> = ref(-1);

  /**
   * 右侧按钮选中id
   */
  const rightButtonSelectedId: Ref<number> = ref(-1);

  /**
   * 重置id
   */
  const resetId = () => {
    leftButtonSelectedId.value = -1;
    rightButtonSelectedId.value = -1;
  };

  return { leftButtonSelectedId, rightButtonSelectedId, resetId };
});
