<!-- 避难所组件 -->
<template>
  <div>
    <!-- 加载避难所 -->
    <LoadingPoints
      v-if="
        useStatusStore().appLoadingCompleted &&
        emergencyShelterPoints.length > 0
      "
      :base-points="emergencyShelterPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.emergencyShelterPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.EMERGENCY_SHELTER"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="emergencyShelterPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().emergencyShelter.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().emergencyShelter.id"
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
  import { useEmergencyShelterPoint } from '@/hooks/rain-earthquake/useEmergencyShelterPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const emergencyShelterPoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const emergencyShelterPointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useEmergencyShelterPoint();

  $api.emergencyShelter.getBasePoints().then((res) => {
    emergencyShelterPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().emergencyShelter.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取避难所数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.emergencyShelter.getPointDetailById(
        useLoadingInformationStore().emergencyShelter.id
      );

      // 更新数据
      emergencyShelterPointDetail.value = res.data;
      informationBoxTitle.value = res.data.name || '避难所信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().emergencyShelter.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showRefugeeShelter.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示避难所
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.EMERGENCY_SHELTER
          )
        );
      } else {
        // 隐藏避难所
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.EMERGENCY_SHELTER
          )
        );
      }
    }
  );
</script>

<style scoped></style>
