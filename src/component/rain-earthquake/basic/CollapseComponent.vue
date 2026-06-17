<!-- 崩塌隐患点组件 -->
<template>
  <div>
    <!-- 加载崩塌隐患点 -->
    <LoadingPoints
      v-if="statusStore.appLoadingCompleted && collapsePoints.length > 0"
      :base-points="collapsePoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.collapseHiddenPointId"
      :is-default="true"
      :loading-resource-field="LoadingResource.COLLAPSE_HIDDEN_POINT"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="collapsePointDetail as Record<string, any>"
      :field="field"
      :style="style"
      v-if="loadingInformationStore.collapseHiddenPoint.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="loadingInformationStore.collapseHiddenPoint.id"
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
  import { useSimulationIdStore } from '@/stores/useSimulationIdStore';

  const collapsePoints = ref<Point[]>([]);

  const statusStore = useStatusStore();
  const loadingInformationStore = useLoadingInformationStore();
  const loadingResourceStore = useLoadingResourceStore();
  const simulationIdStore = useSimulationIdStore();

  const { field, style, getDisasterIcon } = useHiddenPoint();

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const collapsePointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 加载崩塌隐患点数据
  $api.hiddenDangerSpots
    .getBasePoints(HiddenDangerPointTypeMap[PointType.COLLAPSE])
    .then((res) => {
      collapsePoints.value = res.data;
    });

  // 监听id变化
  watch(
    () => loadingInformationStore.collapseHiddenPoint.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取崩塌隐患点数据
      const clickObject = loadingInformationStore.clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hiddenDangerSpots.getPointDetailById(
        loadingInformationStore.collapseHiddenPoint.id,
        simulationIdStore.status ? simulationIdStore.id : -1
      );

      // 更新数据
      collapsePointDetail.value = res.data;
      informationBoxTitle.value = res.data.disasterName || '崩塌隐患点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        loadingInformationStore.collapseHiddenPoint.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => statusStore.poiLayers.showCollapseHiddenPoint.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示崩塌隐患点
        CesiumUtilsSingleton.batchShowPrimitives(
          loadingResourceStore.getLoadingResource(
            LoadingResource.COLLAPSE_HIDDEN_POINT
          ).ids
        );
      } else {
        // 隐藏崩塌隐患点
        CesiumUtilsSingleton.batchHidePrimitives(
          loadingResourceStore.getLoadingResource(
            LoadingResource.COLLAPSE_HIDDEN_POINT
          ).ids
        );
      }
    }
  );
</script>

<style scoped></style>
