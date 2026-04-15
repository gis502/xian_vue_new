<!-- 风险点组件 -->
<template>
  <div>
    <!-- 加载风险点 -->
    <LoadingPoints
      v-if="useStatusStore().appLoadingCompleted && riskPoints.length > 0"
      :base-points="riskPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.riskPointId"
      :is-default="true"
      :loading-resource-field="LoadingResource.RISK_POINT"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="riskPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().getLoadingRiskPointInformationStatus()"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().getRiskPointId()"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { $api } from '@/api/api.ts';
  import type { Point } from '@/types/base/Point';
  import LoadingPoints from '@/component/rain-earthquake/LoadingPoints.vue';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { useRiskPoint } from '@/hooks/rain-earthquake/useRiskPoint';
  import { LoadingResource } from '@/types/common/LoadingResourceType';

  const riskPoints = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const riskPointDetail = ref<Point>();

  // 获取钩子函数
  const { informationBoxTitle, field, getDisasterIcon } = useRiskPoint();

  $api.riskSpots.getBasePoins().then((res) => {
    riskPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().getRiskPointId(),
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取风险点数据
      const clickObject = useLoadingInformationStore().getClickObject();

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.riskSpots.getPointDetailById(
        useLoadingInformationStore().getRiskPointId()
      );

      // 更新数据
      riskPointDetail.value = res.data;

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().setLoadingRiskPointInformationStatus(true);
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );
</script>

<style scoped></style>
