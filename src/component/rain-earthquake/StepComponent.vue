<template>
  <div class="step-box">
    <el-steps
      style="max-width: 100%"
      :active="useStepStore().currentStep"
      finish-status="success"
      simple
      v-if="useStepStore().stepList.length > 0"
    >
      <el-step
        v-for="(item, index) in useStepStore().stepList"
        :key="index"
        :title="item"
      />
    </el-steps>
  </div>
</template>

<script lang="ts" setup>
  import { useStepStore } from '@/stores/useStepStore';
</script>

<style scoped>
  .step-box {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50px;
    left: 0;
    background-color: rgba(14, 52, 98, 0.8);
    z-index: 1000;
  }
</style>
