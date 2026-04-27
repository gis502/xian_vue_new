<!-- 隐患点组件 -->
<template>
  <div>
    <!-- 加载基础隐患点 -->
    <LoadingPoints
      v-if="useStatusStore().appLoadingCompleted && baseHiddenPoints.length > 0"
      :base-points="baseHiddenPoints"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.hiddenDangerPointId"
      :is-default="true"
      :loading-resource-field="LoadingResource.HIDDEN_DANGER_POINT"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="hiddenDangerPointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().hiddenPoint.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().hiddenPoint.id"
    />
  </div>
</template>

<script setup lang="ts">
  import { DisasterType } from '@/types/common/DisasterType.ts';
  import { ref, watch } from 'vue';
  import { $api } from '@/api/api.ts';
  import type { Point } from '@/types/base/Point.ts';
  import LoadingPoints from '@/component/common/LoadingPoints.vue';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation.ts';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
  import { useHiddenPoint } from '@/hooks/rain-earthquake/useHiddenPoint.ts';
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import { LoadingResource } from '@/types/common/LoadingResourceType.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  // 接收父组件传递的参数
  const props = defineProps<{
    disasterType: DisasterType;
  }>();

  // 基本隐患点数据
  const baseHiddenPoints = ref<Point[]>([]);
  // 信息框相关字段
  const informationBoxTitle = ref('');
  const offsetX = ref(0);
  const offsetY = ref(0);
  const hiddenDangerPointDetail = ref<Point>();

  // 获取钩子函数
  const { field, getDisasterIcon } = useHiddenPoint();

  $api.hiddenDangerSpots.getBasePoints(props.disasterType).then((res) => {
    baseHiddenPoints.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().hiddenPoint.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }

      // 获取隐患点数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.hiddenDangerSpots.getPointDetailById(
        useLoadingInformationStore().hiddenPoint.id
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
        useLoadingInformationStore().hiddenPoint.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().mapLayers.hiddenDangerPointShow.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示隐患点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.HIDDEN_DANGER_POINT
          )
        );
      } else {
        // 隐藏隐患点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.HIDDEN_DANGER_POINT
          )
        );
      }
    }
  );
</script>
<style scoped></style>
