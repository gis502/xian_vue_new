<template>
  <div class="button-component-container">
    <div class="button-group">
      <el-button
        :type="'success'"
        :icon="Download"
        :disabled="false"
        @click="handleExport"
      >
        导出数据
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Download } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';

  // 定义事件
  const emit = defineEmits<{
    export: []
  }>();

  // 处理导出
  const handleExport = () => {
    ElMessage.info('导出数据功能待实现');
    emit('export');
  };
</script>

<style scoped>
  .button-component-container {
    padding: 10px 20px;
    background-color: rgba(15, 61, 118, 0.8);
    margin: 0;
  }

  .button-group {
    display: flex;
    gap: 12px;
    justify-content: flex-start;
  }
</style>
