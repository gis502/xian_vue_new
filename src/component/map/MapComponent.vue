<template>
  <div class="map_container" id="map-container"></div>

  <!-- 行政区划 -->
  <AdministrativeDivision v-if="useViewerStore().getViewerLoadingCompleted()" />
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted } from 'vue';
  import config from '@/config/config.json';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import AdministrativeDivision from './AdministrativeDivision.vue';
  import { useViewerStore } from '@/stores/useViewerStore';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
  import type { GeoJsonFileType } from '@/types/cesium/GeoJsonFileType';
  import { Color, ScreenSpaceEventType } from 'cesium';
  import type { ClickObject } from '@/types/cesium/ClickObject';
  import { xiAn } from '@/assets';

  onBeforeMount(() => {
    // 初始化为false
    useViewerStore().setViewerLoadingCompleted(false);

    // 重置状态
    useLoadingInformationStore().resetStatue();
  });

  onMounted(async () => {
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

    useViewerStore().setViewerLoadingCompleted(true);

    // 注册全局点击监听器
    CesiumUtilsSingleton.clickLayer((pickedObject: ClickObject) => {
      if (
        pickedObject &&
        pickedObject.id &&
        typeof pickedObject.id === 'string'
      ) {
        const matchResult = pickedObject.id.match(/\d+$/);
        const id = matchResult ? parseInt(matchResult[0]) : -1;

        // 当id改变时候，重置状态
        if (
          useLoadingInformationStore().getHiddenPointId() !== id &&
          useLoadingInformationStore().getRiskPointId() !== id
        ) {
          useLoadingInformationStore().resetStatue();
        }

        // 点击对象
        useLoadingInformationStore().setClickObject(pickedObject);

        // 隐患点
        if (pickedObject.id.startsWith(config.prefix.hiddenDangerPointId)) {
          useLoadingInformationStore().setHiddenPointId(id);
        }

        // 风险点
        else if (pickedObject.id.startsWith(config.prefix.riskPointId)) {
          useLoadingInformationStore().setRiskPointId(id);
        } else {
          // 重置状态
          useLoadingInformationStore().resetStatue();
        }
      } else {
        // 重置状态
        useLoadingInformationStore().resetStatue();
      }
    });

    // 注册全局滚轮监听器
    CesiumUtilsSingleton.getViewer()!.scene.canvas.addEventListener(
      'wheel',
      () => {
        // 设置最小最大高度
        CesiumUtilsSingleton.setHeightLimits();
      }
    );

    // 当行政区超出页面时，自动拉回视角
    CesiumUtilsSingleton.outOverView();

    // 禁止全局默认双击事件
    CesiumUtilsSingleton.getViewer()?.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

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
