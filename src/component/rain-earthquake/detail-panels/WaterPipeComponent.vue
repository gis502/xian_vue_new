<!-- 供水管网 -->
<template>
  <LoadingGeoserverLayer
    :id="`waterPipe`"
    :layers="`xian:xian_water_pipe`"
    @provide-layers="provideLayers"
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import type { ImageryLayer } from 'cesium';
  import { onMounted, watch } from 'vue';
  import LoadingGeoserverLayer from '../../common/LoadingGeoserverLayer.vue';

  // 保存图层引用
  let waterPipeLayer: ImageryLayer | null = null;

  onMounted(() => {
    // 监听显示隐藏
    watch(
      () => useStatusStore().infrastructureLayers.showNetworkSystem.show,
      (newValue: boolean) => {
        waterPipeLayer!.show = newValue;
      }
    );
  });

  /**
   * 提供图层
   * @param layer 图层
   */
  function provideLayers(layer: ImageryLayer) {
    waterPipeLayer = layer;
  }
</script>

<style scoped></style>
