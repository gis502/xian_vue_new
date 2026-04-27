<!-- 加载点的组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { usePointsHandle } from '@/hooks/usePointsHandle.ts';
  import type { Point } from '@/types/base/Point.ts';
  import type { LoadingResource } from '@/types/common/LoadingResourceType.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

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
    const result: { ids: string[]; info: Record<string, unknown>[] } =
      pointsHandle.addPoints(
        props.basePoints,
        props.getDisasterIcon,
        props.prefix,
        props.isDefault
      );

    // 记录id
    useLoadingResourceStore().addLoadingResource(
      props.loadingResourceField!,
      result
    );
  });
</script>

<style scoped></style>
