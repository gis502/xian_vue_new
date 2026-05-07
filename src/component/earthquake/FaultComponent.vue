<!-- 加载断层组件 -->
<template>
  <div></div>
</template>
<script setup lang="ts">
  import { xianFaultData } from '@/assets';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { Color } from 'cesium';
  import { onMounted, watch } from 'vue';
  import { useStatusStore } from '@/stores/useStatusStore.ts';

  const statusStore = useStatusStore();

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

  // 监听断裂带显示/隐藏状态
  watch(
    () => statusStore.mapLayers.faultShow.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示断裂带
        CesiumUtilsSingleton.showGeoJsonLayer('xian-earthque-fault-data');
      } else {
        // 隐藏断裂带
        CesiumUtilsSingleton.hideGeoJsonLayer('xian-earthque-fault-data');
      }
    }
  );
</script>
<style scoped lang="less"></style>
