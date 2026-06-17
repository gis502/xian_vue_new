<template>
  <div
    class="around-analysis-box"
    v-show="statusStore.functionStatus.aroundAnalysis.show"
  >
    <!-- 搜索组件 -->
    <SearchComponent />

    <!-- 按钮组件 -->
    <ButtonComponent />

    <!-- 具体功能组件 -->
    <AroundAnalysisDetailComponent />

    <!-- 脉冲点列表组件 -->
    <PulsePointListComponent />
  </div>
</template>

<script lang="ts" setup>
import { provide } from 'vue';//从Vue导入provide函数，用于依赖注入
import { useStatusStore } from '@/stores/useStatusStore';
import { useAnalysisButton } from '@/hooks/rain-earthquake/useAnalysisButton';
import AroundAnalysisDetailComponent from './around-analysis/AroundAnalysisDetailComponent.vue';
import ButtonComponent from './around-analysis/ButtonComponent.vue';
import SearchComponent from './around-analysis/SearchComponent.vue';
import PulsePointListComponent from './around-analysis/PulsePointListComponent.vue';


const statusStore = useStatusStore();

// 在父组件中创建唯一的 Hook 实例,包含所有周边分析相关的状态和方法
const analysisButtonState = useAnalysisButton();

// 通过 provide 共享给所有子组件（让 TypeScript 自动推断类型）
provide('analysisButtonState', analysisButtonState);
</script>

<style scoped></style>
