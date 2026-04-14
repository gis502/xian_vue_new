<!-- 加载点的组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { usePointsHandle } from '@/hooks/usePointsHandle';
  import type { Point } from '@/types/base/Point';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

  // 属性
  const props = defineProps<{
    basePoints: Point[];
    getDisasterIcon: (disasterType?: string) => string;
    prefix: string;
    showPoints: boolean;
  }>();

  // 点处理钩子
  const pointsHandle = usePointsHandle();

  onMounted(() => {
    // 加载点
    const ids: string[] = pointsHandle.addPoints(
      props.basePoints,
      props.getDisasterIcon,
      props.prefix
    );

    // 显示隐藏点
    if (!props.showPoints) {
      CesiumUtilsSingleton.batchTogglePrimitives(ids, props.showPoints);
    }
  });
</script>

<style scoped></style>
