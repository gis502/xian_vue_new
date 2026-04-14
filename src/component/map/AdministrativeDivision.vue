<!-- 加载行政区划 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useAdministrativeDivision } from '@/hooks/map/useAdministrativeDivision';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { Color } from 'cesium';
  import { onMounted } from 'vue';

  // 配置参数
  const { areas, areasId, areasColor, areaTransparency, labelTransparency } =
    useAdministrativeDivision();

  onMounted(async () => {
    // 构建批量添加配置数组
    const layerConfigs = areasId.map((id, index) => ({
      layerId: id,
      geojsonData: areas[index],
      options: {
        showName: true,
        isDefault: true,
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

    await CesiumUtilsSingleton.batchAddGeoJsonLayers(layerConfigs);

    // 根据状态显示隐藏行政区划
    if (!useStatusStore().getShowAdministrativeDivision()) {
      CesiumUtilsSingleton.batchHideGeoJsonLayers(areasId);
    }
  });
</script>

<style scoped></style>
