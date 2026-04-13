<template>
  <div class="map_container" id="map-container"></div>

  <!-- 行政区划 -->
  <AdministrativeDivision v-if="useViewerStore().getViewerLoadingCompleted()" />
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted } from 'vue';

  import AdministrativeDivision from './AdministrativeDivision.vue';
  import { useViewerStore } from '@/stores/useViewerStore';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';

  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { xiAn } from '@/assets';
  import { Color } from 'cesium';
  import type { GeoJsonFileType } from '@/types/cesium/GeoJsonFileType';
  import config from '@/config/config.json';
  import { useMap } from '@/hooks/map/useMap';

  onBeforeMount(() => {
    // 初始化为false
    useViewerStore().setViewerLoadingCompleted(false);

    // 重置状态
    useLoadingInformationStore().resetStatue();
  });

  onMounted(async () => {
    // 初始化Cesium
    await CesiumUtilsSingleton.initCesiumViewer({
      containerId: 'map-container',
      mark: {
        include: true,
        geoJson: xiAn as GeoJsonFileType,
        color: Color.BLACK.withAlpha(0.8),
        border: {
          width: 3,
        },
      },
    });

    // 设置状态
    useViewerStore().setViewerLoadingCompleted(true);

    // 注册全局点击监听器
    useMap().registerAndClickOnTheListener();

    // 注册全局滚轮监听器
    useMap().registerAScrollListener();

    // 当行政区超出页面时，自动拉回视角
    useMap().automaticallyAdjustThePerspective();

    // 禁止事件
    useMap().prohibitedEvents();

    // 默认视角
    CesiumUtilsSingleton.viewToTarget(
      config.defaultPosition as [number, number, number]
    );
  });
</script>

<style scoped>
  .map_container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
