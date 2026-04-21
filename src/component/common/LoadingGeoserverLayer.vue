<!-- 加载geoserver图层 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
  import type { ImageryLayer } from 'cesium';
  import { onMounted } from 'vue';

  const props = defineProps<{
    id: string;
    layers: string;
  }>();

  const emits = defineEmits<{
    (e: 'provideLayers', layer: ImageryLayer): void;
  }>();

  onMounted(() => {
    // 从环境变量获取 GeoServer 地址
    const geoserverBaseUrl = import.meta.env.VITE_GEOSERVER_BASE_URL;
    const wmsUrl = `${geoserverBaseUrl}/wms`;

    // 创建 WMS 图层并保存引用
    const layers = CesiumUtilsSingleton.createLayersBatch([
      {
        id: props.id,
        type: 'wms',
        provider: 'xian',
        url: wmsUrl,
        layers: props.layers,
        parameters: {
          service: 'WMS',
          version: '1.1.0',
          request: 'GetMap',
          transparent: true,
          format: 'image/png',
          srs: 'EPSG:4326',
        },
      },
    ]);

    emits('provideLayers', layers[0]!);
  });
</script>

<style scoped></style>
