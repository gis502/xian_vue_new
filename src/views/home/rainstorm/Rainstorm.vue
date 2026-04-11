<template>
  <div>
    <BasicComponent :disaster-type="DisasterType.RAINSTORM" :key="DisasterType.EARTHQUAKE"/>
  </div>
</template>

<script setup lang="ts">
import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
import { DisasterType } from '@/types/common/DisasterType';
</script>

<style scoped></style>
