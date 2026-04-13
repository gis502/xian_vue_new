<!-- 隐患点组件 -->
<template>
  <div>
    <!-- 加载基础隐患点 -->
    <LoadingPoints
      v-if="
        useViewerStore().getViewerLoadingCompleted() &&
        baseHiddenPoints.length > 0
      "
      :base-points="baseHiddenPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.hiddenDangerPointId"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="hiddenDangerPointDetail as Record<string, any>"
      :field="field"
      v-if="
        useLoadingInformationStore().getLoadingHiddenPointInformationStatus()
      "
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().getHiddenPointId()"
    />
  </div>
</template>

<script setup lang="ts">
  import { DisasterType } from '@/types/common/DisasterType';
  import { ref, watch } from 'vue';
  import { $api } from '@/api/api.ts';
  import type { Point } from '@/types/base/Point';
  import LoadingPoints from '@/component/rain-earthquake/LoadingPoints.vue';
  import landslide from '@/assets/images/icon/landslide.png';
  import debrisFlow from '@/assets/images/icon/debris-flow.png';
  import flashFlood from '@/assets/images/icon/flash-flood.png';
  import waterlogging from '@/assets/images/icon/waterlogging.png';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useViewerStore } from '@/stores/useViewerStore';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';

  const props = defineProps<{
    disasterType: DisasterType;
  }>();

  const baseHiddenPoints = ref<Point[]>([]);

  const informationBoxTitle = ref('');
  const offsetX = ref(0);
  const offsetY = ref(0);
  const hiddenDangerPointDetail = ref<Point>();

  const field = {
    fieldCode: '野外编号',
    disasterName: '灾害点名称',
    position: '位置',
    disasterType: '灾害类型',
    scaleGrade: '规模等级',
    riskGrade: '风险等级',
  };

  $api.hiddenDangerSpots.getBasePoins(props.disasterType).then((res) => {
    baseHiddenPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().getHiddenPointId(),
    async (newId: number) => {
      if (newId === -1) {
        return;
      }

      // 获取隐患点数据
      const clickObject = useLoadingInformationStore().getClickObject();

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hiddenDangerSpots.getPointDetailById(
        useLoadingInformationStore().getHiddenPointId()
      );

      // 更新数据
      hiddenDangerPointDetail.value = res.data;
      informationBoxTitle.value = res.data.disasterType + '隐患点';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().setLoadingHiddenPointInformationStatus(
          true
        );
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );
</script>

<script lang="ts">
  function getDisasterIcon(disasterType?: string): string {
    switch (disasterType) {
      case '滑坡':
        return landslide;
      case '泥石流':
        return debrisFlow;
      case '内涝':
        return waterlogging;
      case '山洪':
        return flashFlood;
      default:
        throw new Error(`未知的灾害类型: ${disasterType}`);
    }
  }
</script>

<style scoped></style>
