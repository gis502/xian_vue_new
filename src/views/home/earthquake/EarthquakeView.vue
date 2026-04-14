<template>
  <div>
    <BasicComponent
      :disaster-type="DisasterType.EARTHQUAKE"
      :key="route.fullPath"
    />

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
