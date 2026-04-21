<!-- 基础组件 -->
<template>
  <div>
    <!-- 地图组件 -->
    <MapComponent />

    <!-- 隐患点组件 -->
    <HiddenPointComponent
      :disaster-type="props.disasterType"
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().mapLayers.hiddenDangerPointShow.loading
      "
    />

    <!-- 风险点组件 -->
    <RiskPointComponent
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().mapLayers.riskPointShow.loading
      "
    />
  </div>
</template>

<script setup lang="ts">
  import MapComponent from '@/component/map/MapComponent.vue';
  import type { DisasterType } from '@/types/common/DisasterType.ts';
  import HiddenPointComponent from '@/component/rain-earthquake/basic/HiddenPointComponent.vue';
  import RiskPointComponent from '@/component/rain-earthquake/basic/RiskPointComponent.vue';
  import { useStatusStore } from '@/stores/useStatusStore';

  // 获取父组件传递德数据
  const props = defineProps<{
    disasterType: DisasterType;
  }>();
</script>

<style scoped></style>
