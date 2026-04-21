<!-- 医院组件 -->
<template>
  <div>
    <!-- 加载医院 -->
    <LoadingPoints
      v-if="useStatusStore().appLoadingCompleted && hospitalPoints.length > 0"
      :base-points="hospitalPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.hospitalPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.HOSPITAL"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="hospitalPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().hospital.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().hospital.id"
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
  import { useHospitalPoint } from '@/hooks/rain-earthquake/useHospitalPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const hospitalPoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const hospitalPointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useHospitalPoint();

  $api.hospitals.getBasePoins().then((res) => {
    hospitalPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().hospital.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取医院数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hospitals.getPointDetailById(
        useLoadingInformationStore().hospital.id
      );

      // 更新数据
      hospitalPointDetail.value = res.data;
      informationBoxTitle.value = res.data.name || '医院信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().hospital.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().poiLayers.showHospital.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示医院
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.HOSPITAL)
        );
      } else {
        // 隐藏医院
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(LoadingResource.HOSPITAL)
        );
      }
    }
  );
</script>

<style scoped></style>
