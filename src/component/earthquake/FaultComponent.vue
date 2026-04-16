<!-- 加载断层组件 -->
<template>
  <div></div>
</template>
<script setup lang="ts">
  import { xianFaultData } from '@/assets';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { Color } from 'cesium';
  import { onMounted } from 'vue';

  onMounted(() => {
    CesiumUtilsSingleton.addGeoJsonLayer(
      'xian-earthque-fault-data',
      xianFaultData,
      {
        showName: false,
        isDefault: true,
        polylineStyle: {
          width: 2,
          material: Color.RED,
          clampToGround: true,
        },
      }
    );
  });
</script>
<style scoped lang="less"></style>
