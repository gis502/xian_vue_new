<template>
  <!-- 周边分析组件 -->
  <AroundAnalysis
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().functionStatus.aroundAnalysis.loading
    "
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import AroundAnalysis from './function-child/AroundAnalysis.vue';
</script>

<style scoped></style>
