<!-- 左侧图例组件 -->
<template>
  <div
    class="legend-container"
    v-show="
      useStatus.uiComponents.leftLegend.show &&
      Object.keys(useLeftLegend.legendListInfo).length > 0
    "
  >
    <div
      class="legend-box"
      v-for="key in Object.keys(useLeftLegend.legendListInfo)"
      :key="key"
    >
      <div class="legend-title">
        {{ useLeftLegend.legendListInfo[key].title }}
      </div>
      <div
        class="legend-item"
        v-for="(item, index) in useLeftLegend.legendListInfo[key].list"
        :key="index"
      >
        <div
          class="legend-color"
          :style="{ 'background-color': `${item.color}` }"
        ></div>
        <div class="legend-text">
          <span class="legend-text-title">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
  import { useStatusStore } from '@/stores/useStatusStore';

  const useStatus = useStatusStore();
  const useLeftLegend = useLeftLegendStore();
</script>

<style scoped>
  .legend-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    padding: 6px;
    border-radius: 2px;
    display: flex;
    gap: 30px;
    min-width: 240px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    font-family: Arial, sans-serif;
    background: rgba(14, 52, 98, 0.8);
    border: 1px solid rgb(0, 225, 255);
  }

  .legend-box:not(:last-child) {
    border-right: 1px solid rgb(0, 225, 255);
  }

  .legend-title {
    font-weight: bold;
    font-size: 16px;
    text-align: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin: 3px 0;
    font-size: 12px;
    width: 100%;
    color: white;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    border-radius: 2px;
  }
</style>
