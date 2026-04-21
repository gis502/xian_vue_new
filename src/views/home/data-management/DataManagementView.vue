<!-- 数据管理组件 -->
<template>
  <!-- 搜索组件 -->
  <SearchComponent />

  <!-- 表信息组件 -->
  <TableInformationComponent />

  <!-- 表格详情组件 -->
  <TableDetailComponent />
</template>

<script lang="ts" setup>
  import SearchComponent from '@/component/data-management/SearchComponent.vue';
  import TableDetailComponent from '@/component/data-management/TableDetailComponent.vue';
  import TableInformationComponent from '@/component/data-management/TableInformationComponent.vue';
</script>

<style scoped></style>
