<template>
  <div class="button-component-container">
    <div class="button-group">
      <el-button
        v-for="button in buttons"
        :key="button.name"
        :type="button.type"
        :icon="button.icon"
        :disabled="button.disabled"
        @click="button.click"
      >
        {{ button.name }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    Refresh,
    Download,
    Upload
  } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';

  // 定义事件
  const emit = defineEmits<{
    refresh: []
    export: []
    import: []
  }>();

  // 按钮配置
  const buttons = ref([
    {
      name: '刷新列表',
      type: 'primary',
      icon: Refresh,
      disabled: false,
      click: () => {
        ElMessage.success('刷新列表');
        emit('refresh');
      }
    },
    {
      name: '导出数据',
      type: 'success',
      icon: Download,
      disabled: false,
      click: () => {
        ElMessage.info('导出数据功能待实现');
        emit('export');
      }
    },
    {
      name: '导入数据',
      type: 'warning',
      icon: Upload,
      disabled: false,
      click: () => {
        ElMessage.info('导入数据功能待实现');
        emit('import');
      }
    }
  ]);
</script>

<style scoped>
  .button-component-container {
    padding: 10px 20px;
    background-color: rgba(15, 61, 118, 0.8);
    margin: 0 20px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    justify-content: flex-start;
  }
</style>
