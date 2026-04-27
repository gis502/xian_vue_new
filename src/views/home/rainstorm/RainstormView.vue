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
        useStatusStore().appLoadingCompleted &&
        useStatusStore().uiComponents.disasterChainPointShow.loading
      "
      :select-options="selectOptions"
      :table-data-list="tableDatas"
      :table-columns="tableColumns"
      :page-option="paginationConfig"
      @change-conditions="changeConditions"
      @change-current-page="changeCurrentPage"
    />

    <!-- 图例组件 -->
    <LegendComponent
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().uiComponents.legendShow.loading
      "
      :legend-list="legendList"
      :cols-num="2"
    />

    <!-- 左侧按钮组件 -->
    <LeftButtonComponent
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().uiComponents.leftButton.loading
      "
      :button-list="leftButtonInfo"
    />

    <!-- 右侧按钮组件 -->
    <RightButtonComponent
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().uiComponents.rightButton.loading
      "
      :button-list="rightButtonInfo"
    />

    <!-- 控制显示组件 -->
    <ControlShowComponent :constrol-show-list="controlPanel" />

    <!-- 控制显示详情组件 -->
    <ControlShowDetailComponent />

    <!-- 功能组件 -->
    <FunctionComponent />
  </div>
</template>

<script setup lang="ts">
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import ControlShowComponent from '@/component/rain-earthquake/ControlShowComponent.vue';
  import ControlShowDetailComponent from '@/component/rain-earthquake/ControlShowDetailComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import FunctionComponent from '@/component/rain-earthquake/FunctionComponent.vue';
  import LeftButtonComponent from '@/component/rain-earthquake/LeftButtonComponent.vue';
  import LegendComponent from '@/component/rain-earthquake/LegendComponent.vue';
  import RightButtonComponent from '@/component/rain-earthquake/RightButtonComponent.vue';
  import { useRainDisasterChain } from '@/hooks/rainstorm/useRainDisasterChain';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { DisasterType } from '@/types/common/DisasterType.ts';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const {
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    legendList,
    leftButtonInfo,
    rightButtonInfo,
    controlPanel,
    changeConditions,
    changeCurrentPage,
  } = useRainDisasterChain();
</script>

<style scoped></style>
