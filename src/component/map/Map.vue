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

onBeforeMount(() => {
    // 初始化为false
    useViewerStore().setViewerLoadingCompleted(false)

    // 重置状态
    useLoadingInformationStore().resetStatue()
})

onMounted(() => {
    CesiumUtilsSingleton.initCesiumViewer({
        containerId: 'map-container'
    })

    // 注册全局点击监听器
    CesiumUtilsSingleton.clickLayer((pickedObject: any) => {
        if (pickedObject && pickedObject.id && (typeof pickedObject.id === 'string')) {
            const matchResult = pickedObject.id.match(/\d+$/)
            const id = matchResult ? parseInt(matchResult[0]) : -1

            // 当id改变时候，重置状态
            if (useLoadingInformationStore().getHiddenPointId() !== id && useLoadingInformationStore().getRiskPointId() !== id) {
                useLoadingInformationStore().resetStatue()
            }

            // 点击对象
            useLoadingInformationStore().setClickObject(pickedObject)

            // 隐患点
            if (pickedObject.id.startsWith(config.prefix.hiddenDangerPointId)) {
                useLoadingInformationStore().setHiddenPointId(id)
            }

            // 风险点
            else if (pickedObject.id.startsWith(config.prefix.riskPointId)) {
                useLoadingInformationStore().setRiskPointId(id)
            }else {
                // 重置状态
                useLoadingInformationStore().resetStatue()
            }
        } else {
            // 重置状态
            useLoadingInformationStore().resetStatue()
        }
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