<template>
  <div class="analysis-button-box">
    <ul class="analysis-button-ul">
      <li v-for="(buttonItem, index) in analysisButtons" :key="index">
        <button
          @click="handleButtonClick(index, buttonItem.callback)"
          :style="{
            'background-image': `url(${selectedButtonIndex === index ? rightOrangeButton : rightBlueButton})`,
          }"
        >
          {{ selectedButtonIndex === index && buttonItem.activeName ? buttonItem.activeName : buttonItem.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { rightBlueButton, rightOrangeButton } from '@/assets';
import type { AnalysisButtonState } from '@/types/common/useAroundAnalysisType';

// 从父组件注入共享状态，明确指定类型
const analysisButtonState = inject<AnalysisButtonState>('analysisButtonState');

const { 
  selectedButtonIndex, 
  analysisButtons, 
  handleButtonClick 
} = analysisButtonState!;
</script>

<style scoped>
.analysis-button-box {
  position: absolute;
  top: 95px;
  right: 40px;
  z-index: 1000;
  width: 180px;
  padding: 15px 0;
  border-radius: 8px;
}

.analysis-button-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-button-ul li {
  margin: 15px 0 0;
  text-align: center;
}

.analysis-button-ul li button {
  width: 190px;
  height: 30px;
  padding: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background-color: transparent;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 20px center;
  border: none;
  box-shadow: none;
  border-radius: 0;
}
</style>
