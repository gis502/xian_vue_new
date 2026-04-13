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
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import LegendComponent from '@/component/rain-earthquake/LegendComponent.vue';
  import { useRainDisasterChain } from '@/hooks/rainstorm/useRainDisasterChain';
  import { useRainLegend } from '@/hooks/rainstorm/useRainLegend';
  import { DisasterType } from '@/types/common/DisasterType';
  import { useRoute } from 'vue-router';

  const route = useRoute();

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
