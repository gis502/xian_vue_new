<!-- 基础组件 -->
<template>
  <div>
    <!-- 地图组件 -->
    <MapComponent />

    <!-- 隐患点组件 -->
    <HiddenPointComponent :disaster-type="props.disasterType" />

    <!-- 风险点组件 -->

  </div>
</template>

<script setup lang="ts">
import MapComponent from "@/component/map/Map.vue"
import type { DisasterType } from "@/types/common/DisasterType";
import HiddenPointComponent from "./HiddenPointComponent.vue";

// 获取父组件传递德数据
const props = defineProps<{
  disasterType: DisasterType
}>()
</script>

<style scoped></style>
