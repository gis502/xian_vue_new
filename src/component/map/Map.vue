<template>
    <div class="map_container" id="map-container"></div>

    <!-- 行政区划 -->
    <AdministrativeDivision v-if="viewerLoadingCompleted"/>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import config from '@/config/config.json';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import AdministrativeDivision from './AdministrativeDivision.vue';

// 指示器加载完成
let viewerLoadingCompleted = ref(false);

onMounted(() => {
    CesiumUtilsSingleton.initCesiumViewer({
        containerId: 'map-container'
    })
    viewerLoadingCompleted.value = true;
    CesiumUtilsSingleton.viewToTarget(config.defaultPosition as [number, number, number]);
})

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