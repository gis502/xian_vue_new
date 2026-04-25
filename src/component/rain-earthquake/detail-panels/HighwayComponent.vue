<!-- 供水管网 -->
<template>
  <LoadingGeoserverLayer
    :id="`highway`"
    :layers="`xian:xian_highway`"
    @provide-layers="provideLayers"
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import type { ImageryLayer } from 'cesium';
  import { onMounted, watch } from 'vue';
  import LoadingGeoserverLayer from '../../common/LoadingGeoserverLayer.vue';

  // 保存图层引用
  let highwayLayer: ImageryLayer | null = null;

  onMounted(() => {
    // 监听显示隐藏
    watch(
      () => useStatusStore().infrastructureLayers.showHighway.show,
      (newValue: boolean) => {
        highwayLayer!.show = newValue;
      }
    );
  });

  /**
   * 提供图层
   * @param layer 图层
   */
  function provideLayers(layer: ImageryLayer) {
    highwayLayer = layer;
  }
</script>

<style scoped></style>
