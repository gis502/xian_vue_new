<template>
  <div>
    <!-- 基础组件 -->
    <BasicComponent
      :disaster-type="DisasterType.EARTHQUAKE"
      :key="route.fullPath"
    />

    <!-- 灾害链影响列表组件 -->
    <DisasterChainPointComponent
      :select-options="selectOptions"
      :table-data-list="tableDatas"
      :table-columns="tableColumns"
      :page-option="paginationConfig"
      @change-conditions="changeConditions"
      @change-current-page="changeCurrentPage"
    />

    <!-- 图例组件 -->
    <LegendComponent :legend-list="legendList" :cols-num="2" />

    <!-- 左侧按钮组件 -->
    <LeftButtonComponent :button-list="leftButtonInfo" />

    <!-- 右侧按钮组件 -->
    <RightButtonComponent :button-list="rightButtonInfo" />

    <!-- 控制显示组件 -->
    <ControlShowComponent :constrol-show-list="controlPanel" />
  </div>
</template>

<script setup lang="ts">
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import ControlShowComponent from '@/component/rain-earthquake/ControlShowComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import LeftButtonComponent from '@/component/rain-earthquake/LeftButtonComponent.vue';
  import LegendComponent from '@/component/rain-earthquake/LegendComponent.vue';
  import RightButtonComponent from '@/component/rain-earthquake/RightButtonComponent.vue';
  import { useEarthquakeDisasterChain } from '@/hooks/earthquake/useEarthquakeDisasterChain';
  import { useEarthquakeLegend } from '@/hooks/earthquake/useEarthquakeLegend';
  import { DisasterType } from '@/types/common/DisasterType.ts';
  import { watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const {
    conditions,
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    leftButtonInfo,
    rightButtonInfo,
    controlPanel,
    changeConditions,
    changeCurrentPage,
  } = useEarthquakeDisasterChain();

  const { legendList } = useEarthquakeLegend();

  // 监听条件变化
  watch(
    conditions,
    () => {
      console.log('条件改变');
    },
    { deep: true }
  );
</script>

<style scoped></style>
