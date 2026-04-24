<!-- 供水管网 -->
<template>
  <LoadingGeoserverLayer
    :id="`trafficRoad`"
    :layers="`xian:xian_road`"
    @provide-layers="provideLayers"
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import type { ImageryLayer } from 'cesium';
  import { onMounted, watch } from 'vue';
  import LoadingGeoserverLayer from '../../common/LoadingGeoserverLayer.vue';

  // 保存图层引用
  let trafficRoadLayer: ImageryLayer | null = null;

  onMounted(() => {
    // 监听显示隐藏
    watch(
      () => useStatusStore().infrastructureLayers.showTrafficRoad.show,
      (newValue: boolean) => {
        trafficRoadLayer!.show = newValue;
      }
    );
  });

  /**
   * 提供图层
   * @param layer 图层
   */
  function provideLayers(layer: ImageryLayer) {
    trafficRoadLayer = layer;
  }
</script>

<style scoped></style>
