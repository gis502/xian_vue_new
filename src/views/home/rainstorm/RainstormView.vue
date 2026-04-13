<template>
  <div>
    <BasicComponent
      :disaster-type="DisasterType.RAINSTORM"
      :key="route.fullPath"
    />

    <!-- 直接使用钩子返回的数据 -->
    <DisasterChainPointComponent
      :select-options="selectOptions"
      :table-data-list="tableDatas"
      :table-columns="tableColumns"
      :page-option="paginationConfig"
      @change-conditions="changeConditions"
      @change-current-page="changeCurrentPage"
    />

    <LegendComponent :legend-list="legendList" :cols-num="2" />
  </div>
</template>

<script setup lang="ts">
  // 1. 只导入子组件
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import LegendComponent from '@/component/rain-earthquake/LegendComponent.vue';
  import { useRainDisasterChain } from '@/hooks/rainstorm/useRainDisasterChain';
  import { useRainLegend } from '@/hooks/rainstorm/useRainLegend';

  // 2. 只导入核心类型/枚举
  import { DisasterType } from '@/types/common/DisasterType';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  // 4. 执行钩子，拿到所有需要的数据
  const {
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    changeConditions,
    changeCurrentPage,
  } = useRainDisasterChain();

  const { legendList } = useRainLegend();
</script>

<style scoped></style>
