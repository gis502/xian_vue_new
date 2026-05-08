<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`表详情 - ${tableName}`"
    width="90%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading" class="table-detail-container">
      <!-- 数据记录 -->
      <div class="section">
        <div class="section-header">
          <h4>数据记录</h4>
          <span class="record-count">共 {{ total }} 条记录</span>
        </div>

        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="500"
          border
          stripe
        >
          <el-table-column
            v-for="col in columns"
            :key="col.column_name"
            :prop="col.column_name"
            :label="col.column_name"
            :width="getColumnWidth(col.data_type)"
            show-overflow-tooltip
          />

          <!-- 操作列 -->
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button
                size="small"
                type="primary"
                :icon="Edit"
                @click="handleEdit(row)"
              >
                修改
              </el-button>
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import { getTableData } from '@/api/data-management';
  import type { TableColumn, TableDataRecord } from '@/api/data-management';

  // 对话框可见性
  const dialogVisible = ref(false);
  const loading = ref(false);

  // 表名
  const tableName = ref('');

  // 字段信息
  const columns = ref<TableColumn[]>([]);

  // 表数据
  const tableData = ref<TableDataRecord[]>([]);

  // 总记录数
  const total = ref(0);

  // 显示详情对话框
  const showDialog = async (name: string) => {
    tableName.value = name;
    dialogVisible.value = true;
    await loadTableData(name);
  };

  // 加载表数据
  const loadTableData = async (name: string) => {
    loading.value = true;
    try {
      const response = await getTableData(name, 100);
      if (response.code === 200 && response.data) {
        columns.value = response.data.columns || [];
        tableData.value = response.data.data || [];
        total.value = response.data.total || 0;
        ElMessage.success('表数据加载成功');
      } else {
        ElMessage.error(response.message || '获取表数据失败');
      }
    } catch (error) {
      console.error('加载表数据失败:', error);
      ElMessage.error('加载表数据失败');
    } finally {
      loading.value = false;
    }
  };

  // 关闭对话框
  const handleClose = () => {
    columns.value = [];
    tableData.value = [];
    total.value = 0;
  };

  // 根据数据类型设置列宽度
  const getColumnWidth = (dataType?: string): number | undefined => {
    if (!dataType) return undefined;
    if (dataType.includes('int') || dataType.includes('float') || dataType.includes('double')) {
      return 100;
    }
    if (dataType.includes('timestamp') || dataType.includes('date')) {
      return 180;
    }
    if (dataType.includes('varchar') || dataType.includes('text')) {
      return 200;
    }
    return 150;
  };

  // 修改按钮点击事件
  const handleEdit = (row: TableDataRecord) => {
    console.log('修改行数据:', row);
    ElMessage.info('修改功能待实现');
    // TODO: 实现修改逻辑
  };

  // 删除按钮点击事件
  const handleDelete = (row: TableDataRecord) => {
    ElMessageBox.confirm(
      '确定要删除这条记录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      console.log('删除行数据:', row);
      ElMessage.success('删除成功');
      // TODO: 实现删除逻辑，然后重新加载数据
    }).catch(() => {
      ElMessage.info('已取消删除');
    });
  };

  // 暴露方法给父组件
  defineExpose({
    showDialog
  });
</script>

<style scoped>
  .table-detail-container {
    padding: 10px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section h4 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .record-count {
    color: #666;
    font-size: 14px;
  }

  :deep(.el-table) {
    font-size: 13px;
  }

  :deep(.el-table th) {
    background-color: #f5f7fa !important;
    color: #333 !important;
  }

  /* 操作列按钮样式 */
  :deep(.el-table .cell) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
