<!-- 加载点的组件 -->
<template>

</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { usePointsHandle } from '@/hooks/usePointsHandle';
import type { Point } from '@/types/base/Point';

// 属性
const props = defineProps<{
    basePoints: Point[],
    getDisasterIcon: (disasterType: string) => string
}>();

// 点处理钩子
const pointsHandle = usePointsHandle()

onMounted(() => {
    // 加载点
    pointsHandle.addPoints(props.basePoints, props.getDisasterIcon)
})
</script>

<style scoped></style>
