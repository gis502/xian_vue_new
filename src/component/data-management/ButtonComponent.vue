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
  import { ref, computed } from 'vue';
  import {
    Delete,
    Plus,
    Edit,
    Download
  } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import type { TableInfo } from '@/api/data-management';

  // 接收选中的行数据
  const props = defineProps<{
    selectedRows?: TableInfo[]
  }>();

  // 定义事件
  const emit = defineEmits<{
    deleteSelected: []
    addData: []
    modifySelected: []
    export: []
  }>();

  // 按钮是否禁用
  const isSelectedEmpty = computed(() => {
    return !props.selectedRows || props.selectedRows.length === 0;
  });

  // 按钮配置
  const buttons = ref([
    {
      name: '删除选中',
      type: 'danger',
      icon: Delete,
      disabled: isSelectedEmpty,
      click: () => {
        ElMessage.success(`删除 ${props.selectedRows?.length} 条选中数据`);
        emit('deleteSelected');
      }
    },
    {
      name: '新增数据',
      type: 'primary',
      icon: Plus,
      disabled: false,
      click: () => {
        ElMessage.info('新增数据功能待实现');
        emit('addData');
      }
    },
    {
      name: '修改选中',
      type: 'warning',
      icon: Edit,
      disabled: isSelectedEmpty,
      click: () => {
        ElMessage.success(`修改 ${props.selectedRows?.length} 条选中数据`);
        emit('modifySelected');
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
