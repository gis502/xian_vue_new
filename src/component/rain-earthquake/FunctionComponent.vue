<template>
  <!-- 周边分析组件 -->
  <AroundAnalysis
    v-if="
      statusStore.appLoadingCompleted &&
      statusStore.functionStatus.aroundAnalysis.loading
    "
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import AroundAnalysis from './function-child/AroundAnalysis.vue';

  const statusStore = useStatusStore();
</script>

<style scoped></style>
