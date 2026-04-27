import type { LoadingResource } from '@/types/common/LoadingResourceType';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

// 存储按需加载的数据
export const useLoadingResourceStore = defineStore('loadingResource', () => {
  const loadingResource: Ref<
    Partial<
      Record<
        LoadingResource,
        { ids: string[]; info: Record<string, unknown>[] }
      >
    >
  > = ref({});

  // 添加数据
  const addLoadingResource = (
    key: LoadingResource,
    value: { ids: string[]; info: Record<string, unknown>[] }
  ) => {
    loadingResource.value[key] = value;
  };

  // 删除数据
  const removeLoadingResource = (key: LoadingResource) => {
    if (Object.hasOwn(loadingResource.value, key)) {
      delete loadingResource.value[key];
    }
  };

  /**
   * 获取数据
   */
  const getLoadingResource = (key: LoadingResource) => {
    return loadingResource.value[key] || { ids: [], info: [] };
  };

  return {
    loadingResource,
    getLoadingResource,
    addLoadingResource,
    removeLoadingResource,
  };
});
