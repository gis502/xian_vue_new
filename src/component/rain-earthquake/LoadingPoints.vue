<!-- 加载点的组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { usePointsHandle } from '@/hooks/usePointsHandle';
  import type { Point } from '@/types/base/Point';
  import type { LoadingResource } from '@/types/common/LoadingResourceType';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';

  // 属性
  const props = defineProps<{
    basePoints: Point[];
    getDisasterIcon: (disasterType?: string) => string;
    prefix: string;
    isDefault?: boolean;
    loadingResourceField?: LoadingResource;
  }>();

  // 点处理钩子
  const pointsHandle = usePointsHandle();

  onMounted(() => {
    // 加载点
    const ids: string[] = pointsHandle.addPoints(
      props.basePoints,
      props.getDisasterIcon,
      props.prefix,
      props.isDefault
    );

    // 记录id
    useLoadingResourceStore().addLoadingResource(
      props.loadingResourceField!,
      ids
    );
  });
</script>

<style scoped></style>
