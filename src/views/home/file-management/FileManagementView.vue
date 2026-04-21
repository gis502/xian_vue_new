<!-- 文件管理组件 -->
<template>
  <!-- 搜搜组件 -->
  <SearchComponent />

  <!-- 表信息组件 -->
  <TableInformationComponent />

  <!-- 表格详情组件 -->
  <TableDetailComponent />
</template>

<script lang="ts" setup>
  import SearchComponent from '@/component/file-management/SearchComponent.vue';
  import TableDetailComponent from '@/component/file-management/TableDetailComponent.vue';
  import TableInformationComponent from '@/component/file-management/TableInformationComponent.vue';
</script>

<style scoped></style>
