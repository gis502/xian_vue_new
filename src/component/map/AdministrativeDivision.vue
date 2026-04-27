<!-- 加载行政区划 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useAdministrativeDivision } from '@/hooks/map/useAdministrativeDivision';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { LoadingResource } from '@/types/common/LoadingResourceType';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { Color } from 'cesium';
  import { onMounted, watch } from 'vue';

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

    // 记录行政区划id
    useLoadingResourceStore().addLoadingResource(
      LoadingResource.ADMINISTRATIVE_DIVISION,
      { ids: areasId, names: [] } // 此处name不进行记录
    );
  });

  // 监听显示状态改变
  watch(
    () => useStatusStore().mapLayers.showAdministrativeDivision.show,
    (newValue: boolean) => {
      if (newValue) {
        CesiumUtilsSingleton.batchShowGeoJsonLayers(areasId);
      } else {
        CesiumUtilsSingleton.batchHideGeoJsonLayers(areasId);
      }
    }
  );
</script>

<style scoped></style>
