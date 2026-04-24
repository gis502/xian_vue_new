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

  <!-- 学校 -->
  <SchoolComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showSchool.loading
    "
  />

  <!-- 人口网格 -->
  <PopulationGridComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().poiLayers.showPopulationGrid.loading
    "
  />

  <!-- 管网系统 -->
  <WaterPipeComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().infrastructureLayers.showNetworkSystem.loading
    "
  />

  <!-- 交通道路 -->
  <TrafficRoadComponent
    v-if="
      useStatusStore().appLoadingCompleted &&
      useStatusStore().infrastructureLayers.showTrafficRoad.loading
    "
  />
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import HospitalComponent from './detail-panels/HospitalComponent.vue';
  import DangerousSourceComponent from './detail-panels/DangerousSourceComponent.vue';
  import EmergencyShelterComponent from './detail-panels/EmergencyShelterComponent.vue';
  import FireStationComponent from './detail-panels/FireStationComponent.vue';
  import StorePointsComponent from './detail-panels/StorePointsComponent.vue';
  import PopulationGridComponent from './detail-panels/PopulationGridComponent.vue';
  import WaterPipeComponent from './detail-panels/WaterPipeComponent.vue';
  import SchoolComponent from './detail-panels/SchoolComponent.vue';
  import TrafficRoadComponent from '@/component/rain-earthquake/detail-panels/TrafficRoadComponent.vue';
</script>

<style scoped lang="less"></style>
