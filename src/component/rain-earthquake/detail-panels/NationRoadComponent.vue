<!-- 供水管网 -->
<template>
  <LoadingGeoserverLayer
    :id="`nationalRoad`"
    :layers="`xian:xian_national_road`"
    @provide-layers="provideLayers"
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import type { ImageryLayer } from 'cesium';
  import { onMounted, watch } from 'vue';
  import LoadingGeoserverLayer from '../../common/LoadingGeoserverLayer.vue';

  // 保存图层引用
  let mainRoadLayer: ImageryLayer | null = null;

  onMounted(() => {
    // 监听显示隐藏
    watch(
      () => useStatusStore().infrastructureLayers.showMainRoad.show,
      (newValue: boolean) => {
        mainRoadLayer!.show = newValue;
      }
    );
  });

  /**
   * 提供图层
   * @param layer 图层
   */
  function provideLayers(layer: ImageryLayer) {
    mainRoadLayer = layer;
  }
</script>

<style scoped></style>
