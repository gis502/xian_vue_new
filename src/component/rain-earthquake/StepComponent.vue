<template>
  <div class="step-box" v-show="useStatusStore().uiComponents.stepBar.show">
    <el-steps
      style="width: 100%; background-color: #ffffff00"
      :active="useStepStore().currentStep"
      finish-status="success"
      process-status="success"
      align-center
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
  import { useStatusStore } from '@/stores/useStatusStore';
  import { useStepStore } from '@/stores/useStepStore';
</script>

<style scoped>
  .step-box {
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50px;
    left: 0;
    background-color: rgba(14, 52, 98, 0.8);
    z-index: 1000;
  }

  :deep(.is-wait) {
    color: #fff;
  }
</style>
