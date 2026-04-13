<!-- 风险点组件 -->
<template>
  <div>
    <!-- 加载风险点 -->
    <LoadingPoints
      v-if="
        useViewerStore().getViewerLoadingCompleted() && riskPoints.length > 0
      "
      :base-points="riskPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.riskPointId"
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
  import riskArea from '@/assets/images/icon/risk-area.png';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useViewerStore } from '@/stores/useViewerStore';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

  const riskPoints = ref<Point[]>([]);

  const informationBoxTitle = '风险区域';
  const offsetX = ref(0);
  const offsetY = ref(0);
  const riskPointDetail = ref<Point>();

  const field = {
    riskName: '风险区名称',
    unitCode: '统一编号',
    housing: '住房（间）',
    permanentPopulation: '常住人口（人）',
    residentCounts: '居民户数（户）',
    riskProperty: '威胁财产（万元）',
    inspectorName: '巡查员姓名',
    inspectorTele: '巡查员手机号',
    position: '位置',
    lon: '经度',
    lat: '纬度',
  };

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

<script lang="ts">
  function getDisasterIcon(): string {
    return riskArea;
  }
</script>

<style scoped></style>
