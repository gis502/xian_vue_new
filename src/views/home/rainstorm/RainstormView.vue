<template>
  <div>
    <!-- 基本组件 -->
    <BasicComponent
      :disaster-type="DisasterType.RAINSTORM"
      :key="route.fullPath"
    />

    <!-- 灾害链影像点列表 -->
    <DisasterChainPointComponent
      :select-options="selectOptions"
      :table-data-list="tableDatas"
      :table-columns="tableColumns"
      :page-option="paginationConfig"
      @change-conditions="changeConditions"
      @change-current-page="changeCurrentPage"
    />
  </div>
</template>

<script setup lang="ts">
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import DisasterChainPointComponent from '@/component/rain-earthquake/DisasterChainPointComponent.vue';
  import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
  import { DisasterType, HiddenPointType } from '@/types/common/DisasterType';
  import type { PaginationType } from '@/types/common/PaginationType';
  import { ref, watch, type Ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<script lang="ts">
  // 灾害链影像点列表数据
  // 搜索条件
  const conditions: Ref<{ tableData: string; hiddenPoint: HiddenPointType }> =
    ref({ tableData: '', hiddenPoint: HiddenPointType.LANDSLIDE });

  // 下拉列表
  const selectOptions = [
    {
      value: HiddenPointType.LANDSLIDE,
      label: '滑坡',
    },
    {
      value: HiddenPointType.DEBRIS_FLOW,
      label: '泥石流',
    },
    {
      value: HiddenPointType.FLASH_FLOOD,
      label: '山洪',
    },
    {
      value: HiddenPointType.WATERLOGGING,
      label: '内涝',
    },
  ];

  // 表格数据
  const tableDatas: Ref<XianHiddenDangerSpots[]> = ref([]);

  // 表头标签
  const tableColumns = [
    {
      title: `名称`,
      key: 'disasterName',
    },
    {
      title: '位置',
      key: 'position',
    },
    {
      title: '规模等级',
      key: 'scaleGrade',
    },
    {
      title: '险情等级',
      key: 'riskGrade',
    },
  ];

  // 分页配置
  const paginationConfig: Ref<PaginationType> = ref({
    currentPage: 1,
    pageSize: 10,
    total: 10,
    totalPage: 1,
  });

  // 修改条件
  function changeConditions(value: {
    tableData: string;
    hiddenPoint: HiddenPointType;
  }) {
    conditions.value = value;
  }

  // 修改当前页码
  function changeCurrentPage(value: number) {
    paginationConfig.value.currentPage = value;
  }

  // 条件改变时候触发
  watch(
    () => conditions,
    () => {
      console.log('条件改变');
    },
    { deep: true }
  );
</script>

<style scoped></style>
