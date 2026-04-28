<!-- 山洪隐患点组件 -->
<template>
  <div>
    <!-- 加载山洪隐患点 -->
    <LoadingPoints
      v-if="useStatusStore().appLoadingCompleted && flashFloodPoints.length > 0"
      :base-points="flashFloodPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.flashFloodHiddenPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.FLASH_FLOOD_HIDDEN_POINT"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="flashFloodPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().flashFloodHiddenPoint.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().flashFloodHiddenPoint.id"
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
  import { PointType, HiddenDangerPointTypeMap } from '@/types/common/DisasterType.ts';

  const flashFloodPoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const flashFloodPointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useHiddenPoint();

  // 加载山洪隐患点数据
  $api.hiddenDangerSpots.getBasePoints(HiddenDangerPointTypeMap[PointType.FLASH_FLOOD]).then((res) => {
    flashFloodPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().flashFloodHiddenPoint.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取山洪隐患点数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hiddenDangerSpots.getPointDetailById(
        useLoadingInformationStore().flashFloodHiddenPoint.id
      );

      // 更新数据
      flashFloodPointDetail.value = res.data;
      informationBoxTitle.value = res.data.disasterName || '山洪隐患点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().flashFloodHiddenPoint.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showFlashFloodHiddenPoint.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示山洪隐患点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.FLASH_FLOOD_HIDDEN_POINT)
            .ids
        );
      } else {
        // 隐藏山洪隐患点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.FLASH_FLOOD_HIDDEN_POINT)
            .ids
        );
      }
    }
  );
</script>

<style scoped></style>
