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

onBeforeMount(() => {
    // 初始化为false
    useViewerStore().setViewerLoadingCompleted(false)

    // 清除viewer相关资源
    if (CesiumUtilsSingleton.getViewer()) {
        CesiumUtilsSingleton.clearAllResources('all')
    }
})

onMounted(() => {
    CesiumUtilsSingleton.initCesiumViewer({
        containerId: 'map-container'
    })

    // 更新完成状态
    useViewerStore().setViewerLoadingCompleted(true)
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