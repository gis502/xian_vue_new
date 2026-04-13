<template>
  <div>
    <BasicComponent
      :disaster-type="DisasterType.EARTHQUAKE"
      :key="route.fullPath"
    />
  </div>
</template>

<script setup lang="ts">
  import BasicComponent from '@/component/rain-earthquake/BasicComponent.vue';
  import { DisasterType } from '@/types/common/DisasterType';
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<style scoped></style>
