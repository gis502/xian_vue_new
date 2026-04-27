<!-- 危险源组件 -->
<template>
  <div>
    <!-- 加载危险源 -->
    <LoadingPoints
      v-if="
        useStatusStore().appLoadingCompleted && dangerousSourcePoints.length > 0
      "
      :base-points="dangerousSourcePoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.dangerousSourcePointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.DANGEROUS_SOURCE"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="dangerousSourcePointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().dangerousSource.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().dangerousSource.id"
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
  import { useDangerousSourcePoint } from '@/hooks/rain-earthquake/useDangerousSourcePoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const dangerousSourcePoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const dangerousSourcePointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useDangerousSourcePoint();

  $api.dangerousSource.getBasePoints().then((res) => {
    dangerousSourcePoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().dangerousSource.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取危险源数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.dangerousSource.getPointDetailById(
        useLoadingInformationStore().dangerousSource.id
      );

      // 更新数据
      dangerousSourcePointDetail.value = res.data;
      informationBoxTitle.value = res.data.name || '危险源信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().dangerousSource.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showDangerSource.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示危险源
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.DANGEROUS_SOURCE
          ).ids
        );
      } else {
        // 隐藏危险源
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.DANGEROUS_SOURCE
          ).ids
        );
      }
    }
  );
</script>

<style scoped></style>
