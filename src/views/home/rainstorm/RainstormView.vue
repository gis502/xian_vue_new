<template>
  <div>
    <!-- 基础组件 -->
    <BasicComponent
      :disaster-type="DisasterType.RAINSTORM"
      :key="route.fullPath"
    />

    <!-- 灾害链影响列表组件 -->
    <DisasterChainPointComponent
      v-if="
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.disasterChainPointShow.loading
      "
      :select-options="disasterChainTableStore.selectOptions"
      :table-data-list="disasterChainTableStore.tableDatas"
      :table-columns="disasterChainTableStore.tableColumns"
      :page-option="disasterChainTableStore.paginationConfig"
      @change-conditions="disasterChainTableStore.changeConditions"
      @change-current-page="disasterChainTableStore.changeCurrentPage"
    />

    <!-- 左侧按钮组件 -->
    <LeftButtonComponent
      v-if="
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.leftButton.loading
      "
      :button-list="leftButtonInfo"
    />

    <!-- 左侧图例组件 -->
    <LeftLegendComponent
      v-if="
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.leftLegend.loading
      "
    />

    <!-- 右侧按钮组件 -->
    <RightButtonComponent
      v-if="
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.rightButton.loading
      "
      :button-list="rightButtonInfo"
    />

    <!-- 控制显示组件 -->
    <ControlShowComponent :constrol-show-list="controlPanel" />

    <!-- 控制显示详情组件 -->
    <ControlShowDetailComponent />

    <!-- 功能组件 -->
    <FunctionComponent />

    <!-- 步骤组件 -->
    <StepComponent />
  </div>
</template>

<script setup lang="ts">
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import ControlShowComponent from '@/component/rain-earthquake/ControlShowComponent.vue';
  import ControlShowDetailComponent from '@/component/rain-earthquake/ControlShowDetailComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import FunctionComponent from '@/component/rain-earthquake/FunctionComponent.vue';
  import LeftButtonComponent from '@/component/rain-earthquake/LeftButtonComponent.vue';
  import LeftLegendComponent from '@/component/rain-earthquake/LeftLegendComponent.vue';
  import RightButtonComponent from '@/component/rain-earthquake/RightButtonComponent.vue';
  import StepComponent from '@/component/rain-earthquake/StepComponent.vue';
  import { useRainDisasterChain } from '@/hooks/rainstorm/useRainDisasterChain';
  import { useDisasterChainTableStore } from '@/stores/useDisasterChainTableStore';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { DisasterType, PointType } from '@/types/common/DisasterType.ts';
  import { onBeforeMount } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const { leftButtonInfo, rightButtonInfo, controlPanel } =
    useRainDisasterChain();

  const statusStore = useStatusStore();

  const disasterChainTableStore = useDisasterChainTableStore();

  onBeforeMount(() => {
    // 设置相关数据
    disasterChainTableStore.selectOptions = [
      { value: PointType.LANDSLIDE, label: '滑坡' },
      { value: PointType.DEBRIS_FLOW, label: '泥石流' },
      { value: PointType.FLASH_FLOOD, label: '山洪' },
      { value: PointType.WATER_LOGGING, label: '内涝' },
    ];

    disasterChainTableStore.tableColumns = [
      { title: '名称', key: 'disasterName' },
      { title: '位置', key: 'position' },
      { title: '规模等级', key: 'scaleGrade' },
      { title: '险情等级', key: 'riskGrade' },
    ];
  });
</script>

<style scoped></style>
