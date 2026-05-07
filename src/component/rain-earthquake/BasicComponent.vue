<!-- 基础组件 -->
<template>
  <div>
    <!-- 地图组件 -->
    <MapComponent />

    <!-- 暴雨场景隐患点组件 -->
    <template v-if="props.disasterType === DisasterType.RAINSTORM">
      <!-- 滑坡隐患点 -->
      <LandslideComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showLandslideHiddenPoint.loading
        "
      />

      <!-- 泥石流隐患点 -->
      <DebrisFlowComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showDebrisFlowHiddenPoint.loading
        "
      />

      <!-- 内涝隐患点 -->
      <WaterLoggingComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showWaterLoggingHiddenPoint.loading
        "
      />

      <!-- 山洪隐患点 -->
      <FlashFloodComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showFlashFloodHiddenPoint.loading
        "
      />

      <!-- 降雨栅格图层组件 -->
      <RainfallGridComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.weatherLayers.showRainfallGrid.loading
        "
      />
    </template>

    <!-- 地震场景隐患点组件 -->
    <template v-else-if="props.disasterType === DisasterType.EARTHQUAKE">
      <!-- 滑坡隐患点 -->
      <LandslideComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showLandslideHiddenPoint.loading
        "
      />

      <!-- 泥石流隐患点 -->
      <DebrisFlowComponent
        v-if="
          useStatus.appLoadingCompleted &&
          useStatus.poiLayers.showDebrisFlowHiddenPoint.loading
        "
      />
    </template>

    <!-- 风险点组件 -->
    <RiskPointComponent
      v-if="
        useStatus.appLoadingCompleted &&
        useStatus.mapLayers.riskPointShow.loading
      "
    />
  </div>
</template>

<script setup lang="ts">
  import MapComponent from '@/component/map/MapComponent.vue';
  import { DisasterType } from '@/types/common/DisasterType.ts';
  import RiskPointComponent from '@/component/rain-earthquake/basic/RiskPointComponent.vue';
  import LandslideComponent from '@/component/rain-earthquake/basic/LandslideComponent.vue';
  import DebrisFlowComponent from '@/component/rain-earthquake/basic/DebrisFlowComponent.vue';
  import WaterLoggingComponent from '@/component/rain-earthquake/basic/WaterLoggingComponent.vue';
  import FlashFloodComponent from '@/component/rain-earthquake/basic/FlashFloodComponent.vue';
  import RainfallGridComponent from '@/component/rain-earthquake/detail-panels/RainfallGridComponent.vue';
  import { useStatusStore } from '@/stores/useStatusStore';

  const useStatus = useStatusStore();

  // 获取父组件传递德数据
  const props = defineProps<{
    disasterType: DisasterType;
  }>();
</script>

<style scoped></style>
