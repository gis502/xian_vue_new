<!-- 物资储备点组件 -->
<template>
  <div>
    <!-- 加载物资储备点 -->
    <LoadingPoints
      v-if="
        useStatusStore().appLoadingCompleted && storePointsList.length > 0
      "
      :base-points="storePointsList"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.storePointsPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.STORE_POINTS"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="storePointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().storePoints.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().storePoints.id"
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
  import { useStorePointsPoint } from '@/hooks/rain-earthquake/useStorePointsPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const storePointsList = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const storePointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useStorePointsPoint();

  $api.storePoints.getBasePoints().then((res) => {
    storePointsList.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().storePoints.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取物资储备点数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.storePoints.getPointDetailById(
        useLoadingInformationStore().storePoints.id
      );

      // 更新数据
      storePointDetail.value = res.data;
      informationBoxTitle.value = res.data.name || '物资储备点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().storePoints.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showReservePoint.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示物资储备点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.STORE_POINTS
          )
        );
      } else {
        // 隐藏物资储备点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.STORE_POINTS
          )
        );
      }
    }
  );
</script>

<style scoped></style>
