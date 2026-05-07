<!-- 地铁站点组件 -->
<template>
  <div>
    <!-- 加载地铁站点点位 -->
    <LoadingPoints
      v-if="useStatus.appLoadingCompleted && subwayStationList.length > 0"
      :base-points="subwayStationList"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.subwayStationPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.SUBWAY_STATION"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="subwayStationDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformation.subwayStation.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformation.subwayStation.id"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { $api } from '@/api/api.ts';
  import type { Point } from '@/types/base/Point.ts';
  import LoadingPoints from '@/component/common/LoadingPoints.vue';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation.ts';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
  import { LoadingResource } from '@/types/common/LoadingResourceType.ts';
  import { useSubwayStationPoint } from '@/hooks/rain-earthquake/useSubwayStationPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const subwayStationList = ref<Point[]>([]);

  const useStatus = useStatusStore();
  const useLoadingInformation = useLoadingInformationStore();
  const useLoadingResource = useLoadingResourceStore();

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const subwayStationDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useSubwayStationPoint();

  $api.subwayStations.getBasePoints().then((res) => {
    subwayStationList.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformation.subwayStation.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取地铁站点数据
      const clickObject = useLoadingInformation.clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.subwayStations.getPointDetailById(
        useLoadingInformation.subwayStation.id
      );

      // 更新数据
      subwayStationDetail.value = res.data;
      informationBoxTitle.value = res.data.stationName || '地铁站点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformation.subwayStation.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatus.poiLayers.showSubwayStation?.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示地铁站点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResource.getLoadingResource(
            LoadingResource.SUBWAY_STATION
          ).ids
        );
      } else {
        // 隐藏地铁站点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResource.getLoadingResource(
            LoadingResource.SUBWAY_STATION
          ).ids
        );
      }
    }
  );
</script>

<style scoped></style>
