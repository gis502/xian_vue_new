<template>
  <!-- 加载人口网格 -->
  <LoadingGeoserverLayer
    :id="`people`"
    :layers="`xian:xian_people`"
    @provide-layers="provideLayers"
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import type { ImageryLayer } from 'cesium';
  import { onMounted, watch } from 'vue';
  import LoadingGeoserverLayer from './LoadingGeoserverLayer.vue';

  // 保存图层引用
  let populationLayer: ImageryLayer | null = null;

  onMounted(() => {
    // 监听显示隐藏风险点
    watch(
      () => useStatusStore().poiLayers.showPopulationGrid.show,
      (newValue: boolean) => {
        populationLayer!.show = newValue;
      }
    );
  });

  /**
   * 提供图层
   * @param layer 图层
   */
  function provideLayers(layer: ImageryLayer) {
    populationLayer = layer;
  }
</script>

<style scoped></style>
