<template>
  <div>
    <!-- 基础组件 -->
    <BasicComponent
      :disaster-type="DisasterType.EARTHQUAKE"
      :key="route.fullPath"
    />

    <!-- 断裂带 -->
    <FaultComponent
      v-if="
        useStatusStore().appLoadingCompleted &&
        useStatusStore().mapLayers.faultShow
      "
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
  </div>
</template>

<script setup lang="ts">
  import FaultComponent from '@/component/earthquake/FaultComponent.vue';
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import ControlShowComponent from '@/component/rain-earthquake/ControlShowComponent.vue';
  import ControlShowDetailComponent from '@/component/rain-earthquake/ControlShowDetailComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import LeftButtonComponent from '@/component/rain-earthquake/LeftButtonComponent.vue';
  import RightButtonComponent from '@/component/rain-earthquake/RightButtonComponent.vue';
  import { useEarthquakeDisasterChain } from '@/hooks/earthquake/useEarthquakeDisasterChain';
  import { useStatusStore } from '@/stores/useStatusStore';
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
