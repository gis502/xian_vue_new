<template>
  <div class="button-component-container">
    <div class="button-group">
      <el-button
        :type="'danger'"
        :icon="Delete"
        :disabled="isDeleteDisabled"
        @click="handleDelete"
      >
        删除选中
      </el-button>
      <el-button
        :type="'primary'"
        :icon="Plus"
        :disabled="false"
        @click="handleAdd"
      >
        新增数据
      </el-button>
      <el-button
        :type="'warning'"
        :icon="Edit"
        :disabled="isModifyDisabled"
        @click="handleModify"
      >
        修改选中
      </el-button>
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
  import { computed } from 'vue';
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

  // 按钮是否禁用 - 删除：至少选中一条
  const isDeleteDisabled = computed(() => {
    return !props.selectedRows || props.selectedRows.length === 0;
  });

  // 按钮是否禁用 - 修改：只能选中一条
  const isModifyDisabled = computed(() => {
    return !props.selectedRows || props.selectedRows.length !== 1;
  });

  // 处理删除
  const handleDelete = () => {
    if (isDeleteDisabled.value) {
      ElMessage.warning('请至少选中一条数据');
      return;
    }
    ElMessage.success(`删除 ${props.selectedRows?.length} 条选中数据`);
    emit('deleteSelected');
  };

  // 处理新增
  const handleAdd = () => {
    ElMessage.info('新增数据功能待实现');
    emit('addData');
  };

  // 处理修改
  const handleModify = () => {
    if (isModifyDisabled.value) {
      if (!props.selectedRows || props.selectedRows.length === 0) {
        ElMessage.warning('请选中一条数据');
      } else {
        ElMessage.warning('只能选中一条数据进行修改');
      }
      return;
    }
    ElMessage.success(`修改选中的数据`);
    emit('modifySelected');
  };

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
