<!-- 消防站组件 -->
<template>
  <div>
    <!-- 加载消防站 -->
    <LoadingPoints
      v-if="
        useStatusStore().appLoadingCompleted && fireStationPoints.length > 0
      "
      :base-points="fireStationPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.fireStationPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.FIRE_STATION"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="fireStationPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().fireStation.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().fireStation.id"
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
  import { useFireStationPoint } from '@/hooks/rain-earthquake/useFireStationPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const fireStationPoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const fireStationPointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useFireStationPoint();

  $api.firefighter.getBasePoints().then((res) => {
    fireStationPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().fireStation.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取消防站数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.firefighter.getPointDetailById(
        useLoadingInformationStore().fireStation.id
      );

      // 更新数据
      fireStationPointDetail.value = res.data;
      informationBoxTitle.value = res.data.teamName || '消防站信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().fireStation.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showFireStation.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示消防站
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.FIRE_STATION
          )
        );
      } else {
        // 隐藏消防站
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.FIRE_STATION
          )
        );
      }
    }
  );
</script>

<style scoped></style>
