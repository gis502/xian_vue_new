<template>
    <div class="map_container" id="map-container"></div>
</template>

<script lang="ts" setup>
import { CesiumUtils } from '@/utils/cesium/CesiumUtils';
import { Cartesian3, type Viewer } from 'cesium';
import { onMounted } from 'vue';
import config from '@/config/config.json';

const cesiumUtils = new CesiumUtils();
let viewer: Viewer;

onMounted(() => {
    viewer = cesiumUtils.initCesiumViewer({
        containerId: 'map-container',
    })

    cesiumUtils.viewToTarget(viewer, config.defaultPosition as [number, number, number]);
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