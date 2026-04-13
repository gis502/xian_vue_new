<!-- 加载行政区划 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import {
    baQiao,
    beiLin,
    changAn,
    gaoLing,
    huYi,
    lanTian,
    lianHu,
    linTong,
    weiYang,
    xinCheng,
    yanLiang,
    yanTa,
    zhouZhi,
  } from '@/assets';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { Color } from 'cesium';
  import { onMounted } from 'vue';

  const areas = [
    baQiao,
    beiLin,
    changAn,
    gaoLing,
    huYi,
    lanTian,
    lianHu,
    linTong,
    weiYang,
    xinCheng,
    yanLiang,
    yanTa,
    zhouZhi,
  ];
  const areasId = [
    'baqiao',
    'beilin',
    'changan',
    'gaoling',
    'huyi',
    'lantian',
    'lianhu',
    'lintong',
    'weiyang',
    'xincheng',
    'yanliang',
    'yanta',
    'zhouzhi',
  ];
  const areasColor = [
    new Color(255 / 255, 153 / 255, 0 / 255),
    new Color(255 / 255, 51 / 255, 102 / 255),
    new Color(0 / 255, 178 / 255, 255 / 255),
    new Color(102 / 255, 255 / 255, 102 / 255),
    new Color(204 / 255, 102 / 255, 255 / 255),
    new Color(255 / 255, 204 / 255, 0 / 255),
    new Color(0 / 255, 204 / 255, 153 / 255),
    new Color(255 / 255, 102 / 255, 102 / 255),
    new Color(102 / 255, 153 / 255, 255 / 255),
    new Color(255 / 255, 178 / 255, 102 / 255),
    new Color(153 / 255, 255 / 255, 204 / 255),
    new Color(255 / 255, 153 / 255, 204 / 255),
    new Color(190 / 255, 255 / 255, 232 / 255),
  ];
  const areaTransparency = 0.3;
  const labelTransparency = 1;

  onMounted(() => {
    // 构建批量添加配置数组
    const layerConfigs = areasId.map((id, index) => ({
      layerId: id,
      geojsonData: areas[index],
      isDefault: true,
      options: {
        showName: true,
        labelStyle: {
          labelText: areas[index].features[0].properties.name,
          center: [
            areas[index].features[0].properties.center[0],
            areas[index].features[0].properties.center[1],
            0,
          ] as [number, number, number],
          labelColor: Color.BLACK,
          backgroundColor: areasColor[index].withAlpha(labelTransparency),
        },
        polygonStyle: {
          fill: true,
          fillColor: areasColor[index].withAlpha(areaTransparency),
          outline: false,
        },
      },
    }));

    CesiumUtilsSingleton.batchAddGeoJsonLayers(layerConfigs);
  });
</script>

<style scoped></style>
