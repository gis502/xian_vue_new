<template>
  <!-- 医院 -->
  <HospitalComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showHospital.loading
    "
  />

  <!-- 危险源 -->
  <DangerousSourceComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showDangerSource.loading
    "
  />

  <!-- 避难所 -->
  <EmergencyShelterComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showRefugeeShelter.loading
    "
  />

  <!-- 消防站 -->
  <FireStationComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showFireStation.loading
    "
  />

  <!-- 物资储备点 -->
  <StorePointsComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showReservePoint.loading
    "
  />

  <!-- 人口网格 -->
  <PopulationGridComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showPopulationGrid.loading
    "
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import HospitalComponent from './HospitalComponent.vue';
  import DangerousSourceComponent from './DangerousSourceComponent.vue';
  import EmergencyShelterComponent from './EmergencyShelterComponent.vue';
  import FireStationComponent from './FireStationComponent.vue';
  import StorePointsComponent from './StorePointsComponent.vue';
  import PopulationGridComponent from './PopulationGridComponent.vue';
</script>

<style scoped lang="less"></style>
