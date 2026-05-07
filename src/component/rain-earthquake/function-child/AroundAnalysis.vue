<template>
  <div
    class="around-analysis-box"
    v-show="statusStore.functionStatus.aroundAnalysis.show"
  >
    <!-- 搜索组件 -->
    <SearchComponent />

    <!-- 按钮组件 -->
    <ButtonComponent />

    <!-- 具体功能组件 -->
    <AroundAnalysisDetailComponent />
  </div>
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import AroundAnalysisDetailComponent from './around-analysis/AroundAnalysisDetailComponent.vue';
  import ButtonComponent from './around-analysis/ButtonComponent.vue';
  import SearchComponent from './around-analysis/SearchComponent.vue';

  const statusStore = useStatusStore();
</script>

<style scoped></style>
