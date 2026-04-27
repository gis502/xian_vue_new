<!-- 水库组件 -->
<template>
  <div>
    <!-- 加载水库点位 -->
    <LoadingPoints
      v-if="useStatusStore().appLoadingCompleted && reservoirList.length > 0"
      :base-points="reservoirList"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.reservoirPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.RESERVOIR"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="reservoirDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().reservoir.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().reservoir.id"
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
  import { useReservoirPoint } from '@/hooks/rain-earthquake/useReservoirPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const reservoirList = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const reservoirDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useReservoirPoint();

  $api.reservoirs.getBasePoints().then((res) => {
    reservoirList.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().reservoir.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取水库数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.reservoirs.getPointDetailById(
        useLoadingInformationStore().reservoir.id
      );

      // 更新数据
      reservoirDetail.value = res.data;
      informationBoxTitle.value = res.data.reservoirName || '水库信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().reservoir.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().infrastructureLayers.showReservoir?.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示水库
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.RESERVOIR)
        );
      } else {
        // 隐藏水库
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.RESERVOIR)
        );
      }
    }
  );
</script>

<style scoped></style>
