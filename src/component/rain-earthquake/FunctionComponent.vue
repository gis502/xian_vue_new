<template>
  <!-- 周边分析组件 -->
  <AroundAnalysis
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.functionStatus.aroundAnalysis.loading
    "
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import AroundAnalysis from './function-child/AroundAnalysis.vue';

  const useStatus = useStatusStore();
</script>

<style scoped></style>
