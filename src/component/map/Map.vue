<template>
    <div class="map_container" id="map-container"></div>
</template>

<script lang="ts" setup>
import { Color, type Viewer } from 'cesium';
import { onMounted } from 'vue';
import config from '@/config/config.json';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

import BaQiiao from '@/assets/json/BaQiao.json';
import BeiLin from '@/assets/json/BeiLin.json';
import ChangAn from '@/assets/json/ChangAn.json';
import GaoLing from '@/assets/json/GaoLing.json';
import HuYi from '@/assets/json/HuYi.json';
import LanTian from '@/assets/json/LanTian.json';
import LianHu from '@/assets/json/LianHu.json';
import LinTong from '@/assets/json/LinTong.json';
import WeiYang from '@/assets/json/WeiYang.json';
import XinCheng from '@/assets/json/XinCheng.json';
import YanLiang from '@/assets/json/YanLiang.json';
import YanTa from '@/assets/json/YanTa.json';
import ZhouZhi from '@/assets/json/ZhouZhi.json';

let viewer: Viewer = CesiumUtilsSingleton.getViewer() as Viewer;

const displayAreas = [BaQiiao, BeiLin, ChangAn, GaoLing, HuYi, LanTian, LianHu, LinTong, WeiYang, XinCheng, YanLiang, YanTa, ZhouZhi]

onMounted(() => {
    CesiumUtilsSingleton.initCesiumViewer({
        containerId: 'map-container'
    })
    CesiumUtilsSingleton.viewToTarget(config.defaultPosition as [number, number, number]);
    CesiumUtilsSingleton.batchAddGeoJsonLayers(
        displayAreas.map(area => area.features[0].properties.name),
        displayAreas,
        new Array(displayAreas.length).fill(true),
        displayAreas.map((area, index) => {
            const areaName = area.features[0].properties.name;
            return {
                showName: true,
                labelStyle: {
                    labelText: areaName,
                    center: [area.features[0].properties.center[0], area.features[0].properties.center[1], 0],
                    labelColor: Color.BLACK,
                    backgroundColor: Color.WHITE
                },
                polygonStyle: {
                    fill: true,
                    fillColor: Color.fromBytes(
                        Math.ceil(Math.random() * 255), 
                        Math.ceil(Math.random() * 255), 
                        Math.ceil(Math.random() * 255)
                    ).withAlpha(0.3),
                    outline: false
                }
            }
        })
    );
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