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
        statusStore.appLoadingCompleted &&
        statusStore.mapLayers.faultShow.loading
      "
    />

    <!-- 灾害链影响列表组件 -->
    <DisasterChainPointComponent
      v-if="
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.disasterChainPointShow.loading
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
        statusStore.appLoadingCompleted &&
        statusStore.uiComponents.leftButton.loading
      "
      :button-list="leftButtonInfo"
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
  import {
    useDisasterChainTable,
    type SearchConditions,
  } from '@/hooks/useDisasterChainTable';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { DisasterType, PointType } from '@/types/common/DisasterType.ts';
  import { onBeforeMount } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const { leftButtonInfo, rightButtonInfo, controlPanel } =
    useEarthquakeDisasterChain();

  const statusStore = useStatusStore();

  const {
    selectOptions,
    tableColumns,
    tableDatas,
    paginationConfig,
    changeConditions,
    setConditions,
    changeCurrentPage,
    setSelectOptions,
    setTableColumns,
  } = useDisasterChainTable();

  onBeforeMount(() => {
    // 设置下拉选项
    setSelectOptions([
      { value: PointType.LANDSLIDE, label: '滑坡' },
      { value: PointType.DEBRIS_FLOW, label: '泥石流' },
      { value: PointType.RISK_AREA, label: '风险区' },
    ]);

    // 设置表格列配置
    setTableColumns([
      { title: '名称', key: 'disasterName' },
      { title: '位置', key: 'position' },
      { title: '规模等级', key: 'scaleGrade' },
      { title: '险情等级', key: 'riskGrade' },
    ]);

    /**
     * 条件改变执行
     * @param value
     */
    changeConditions.value = (value: SearchConditions) => {
      setConditions(value);
    };
  });
</script>

<style scoped></style>
