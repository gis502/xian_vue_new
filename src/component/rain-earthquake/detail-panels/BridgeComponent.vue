<!-- 桥梁点组件 -->
<template>
  <div>
    <!-- 加载桥梁点 -->
    <LoadingPoints
      v-if="
        useStatusStore().appLoadingCompleted && bridgeList.length > 0
      "
      :base-points="bridgeList"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.bridgePointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.BRIDGE"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="storePointDetail as Record<string, any>"
      :field="field"
      v-if="useLoadingInformationStore().bridge.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="useLoadingInformationStore().bridge.id"
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
  import { useBridgePoint } from '@/hooks/rain-earthquake/useBridgePoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const bridgeList = ref<Point[]>([]);

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const storePointDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useBridgePoint();

  $api.bridges.getBasePoints().then((res) => {
    bridgeList.value = res.data;
  });

  // 监听id变化
  watch(
    () => useLoadingInformationStore().bridge.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取桥梁点数据
      const clickObject = useLoadingInformationStore().clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.bridges.getPointDetailById(
        useLoadingInformationStore().bridge.id
      );

      // 更新数据
      storePointDetail.value = res.data;
      informationBoxTitle.value = res.data.bridgeName || '桥梁点信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        useLoadingInformationStore().bridge.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => useStatusStore().infrastructureLayers.showBridge.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示桥梁点
        CesiumUtilsSingleton.batchShowPrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.BRIDGE
          )
        );
      } else {
        // 隐藏桥梁点
        CesiumUtilsSingleton.batchHidePrimitives(
          useLoadingResourceStore().getLoadingResource(
            LoadingResource.BRIDGE
          )
        );
      }
    }
  );
</script>

<style scoped></style>
