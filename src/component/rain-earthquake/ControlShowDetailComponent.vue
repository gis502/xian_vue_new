<template>
  <!-- 医院 -->
  <HospitalComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showHospital.loading
    "
  />

  <!-- 危险源 -->
  <DangerousSourceComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showDangerSource.loading
    "
  />

  <!-- 避难所 -->
  <EmergencyShelterComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showRefugeeShelter.loading
    "
  />

  <!-- 消防站 -->
  <FireStationComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showFireStation.loading
    "
  />

  <!-- 物资储备点 -->
  <StorePointsComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showReservePoint.loading
    "
  />

  <!-- 学校 -->
  <SchoolComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showSchool.loading
    "
  />

  <!-- 人口网格 -->
  <PopulationGridComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showPopulationGrid.loading
    "
  />

  <!-- 管网系统 -->
  <WaterPipeComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showNetworkSystem.loading
    "
  />

  <!-- 交通道路 -->
  <TrafficRoadComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showTrafficRoad.loading
    "
  />
  <!-- 高速 -->
  <HighwayComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showHighway.loading
    "
  />
  <!-- 国道 -->
  <NationRoadComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showMainRoad.loading
    "
  />
  <!-- 桥梁 -->
  <BridgeComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showBridge.loading
    "
  />

  <!-- 水库 -->
  <ReservoirComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.infrastructureLayers.showReservoir.loading
    "
  />

  <!-- 地铁站点 -->
  <SubwayStationComponent
    v-if="
      useStatus.appLoadingCompleted &&
      useStatus.poiLayers.showSubwayStation.loading
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
  import HighwayComponent from '@/component/rain-earthquake/detail-panels/HighwayComponent.vue';
  import NationRoadComponent from '@/component/rain-earthquake/detail-panels/NationRoadComponent.vue';
  import BridgeComponent from '@/component/rain-earthquake/detail-panels/BridgeComponent.vue';
  import ReservoirComponent from '@/component/rain-earthquake/detail-panels/ReservoirComponent.vue';
  import SubwayStationComponent from '@/component/rain-earthquake/detail-panels/SubwayStationComponent.vue';

  const useStatus = useStatusStore();
</script>

<style scoped lang="less"></style>
