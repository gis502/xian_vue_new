<!-- 基础组件 -->
<template>
  <div>
    <!-- 地图组件 -->
    <MapComponent />

    <!-- 隐患点组件 -->
    <HiddenPointComponent
      :disaster-type="props.disasterType"
      v-if="useViewerStore().getViewerLoadingCompleted()"
    />

    <!-- 风险点组件 -->
    <RiskPointComponent v-if="useViewerStore().getViewerLoadingCompleted()" />
  </div>
</template>

<script setup lang="ts">
  import MapComponent from '@/component/map/MapComponent.vue';
  import type { DisasterType } from '@/types/common/DisasterType';
  import HiddenPointComponent from './HiddenPointComponent.vue';
  import RiskPointComponent from './RiskPointComponent.vue';
  import { useViewerStore } from '@/stores/useViewerStore';

  // 获取父组件传递德数据
  const props = defineProps<{
    disasterType: DisasterType;
  }>();
</script>

<style scoped></style>
