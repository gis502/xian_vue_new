<template>
  <div class="map_container" id="map-container"></div>

  <!-- 行政区划 -->
  <AdministrativeDivision
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.mapLayers.showAdministrativeDivision.loading
    "
  />
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted } from 'vue';

  import AdministrativeDivision from './AdministrativeDivision.vue';
  import { useStatusStore } from '@/stores/useStatusStore';

  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { xiAn } from '@/assets';
  import { Color } from 'cesium';
  import type { GeoJsonFileType } from '@/types/cesium/GeoJsonFileType';
  import config from '@/config/config.json';
  import { useMap } from '@/hooks/map/useMap';
  import { useScene } from '@/hooks/useScene';

  const { resetScene } = useScene();
  const {
    registerAndClickOnTheListener,
    registerAScrollListener,
    automaticallyAdjustThePerspective,
    prohibitedEvents,
  } = useMap();
  const useStatus = useStatusStore();

  onBeforeMount(() => {
    resetScene();
  });

  onMounted(async () => {
    // 初始化Cesium
    await CesiumUtilsSingleton.initCesiumViewer({
      containerId: 'map-container',
      mark: {
        include: false,
        geoJson: xiAn as GeoJsonFileType,
        color: Color.BLACK.withAlpha(0.8),
        border: {
          width: 3,
        },
      },
    });

    // 设置状态
    useStatus.appLoadingCompleted = true;

    // 注册全局点击监听器
    registerAndClickOnTheListener();

    // 注册全局滚轮监听器
    registerAScrollListener();

    // 当行政区超出页面时，自动拉回视角
    automaticallyAdjustThePerspective();

    // 禁止事件
    prohibitedEvents();

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
