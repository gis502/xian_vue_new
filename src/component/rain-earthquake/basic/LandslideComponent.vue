<!-- 滑坡隐患点组件 -->
<template>
  <div>
    <!-- 加载滑坡隐患点 -->
    <LoadingPoints
      v-if="useStatus.appLoadingCompleted && landslidePoints.length > 0"
      :base-points="landslidePoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.landslideHiddenPointId"
      :is-default="true"
      :loading-resource-field="LoadingResource.LANDSLIDE_HIDDEN_POINT"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="landslidePointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformation.landslideHiddenPoint.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformation.landslideHiddenPoint.id"
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
  import { useHiddenPoint } from '@/hooks/rain-earthquake/useHiddenPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';
  import {
    PointType,
    HiddenDangerPointTypeMap,
  } from '@/types/common/DisasterType.ts';

  const landslidePoints = ref<Point[]>([]);

  const useStatus = useStatusStore();
  const useLoadingInformation = useLoadingInformationStore();
  const useLoadingResource = useLoadingResourceStore();

  const { field, getDisasterIcon } = useHiddenPoint();

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const landslidePointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 加载滑坡隐患点数据
  $api.hiddenDangerSpots
    .getBasePoints(HiddenDangerPointTypeMap[PointType.LANDSLIDE])
    .then((res) => {
      landslidePoints.value = res.data;
    });

  // 监听id变化
  watch(
    () => useLoadingInformation.landslideHiddenPoint.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取滑坡隐患点数据
      const clickObject = useLoadingInformation.clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hiddenDangerSpots.getPointDetailById(
        useLoadingInformation.landslideHiddenPoint.id
      );

      // 更新数据
      landslidePointDetail.value = res.data;
      informationBoxTitle.value = res.data.disasterName || '滑坡隐患点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformation.landslideHiddenPoint.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatus.poiLayers.showLandslideHiddenPoint.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示滑坡隐患点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResource.getLoadingResource(
            LoadingResource.LANDSLIDE_HIDDEN_POINT
          ).ids
        );
      } else {
        // 隐藏滑坡隐患点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResource.getLoadingResource(
            LoadingResource.LANDSLIDE_HIDDEN_POINT
          ).ids
        );
      }
    }
  );
</script>

<style scoped></style>
