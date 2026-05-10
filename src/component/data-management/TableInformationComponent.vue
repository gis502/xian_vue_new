<template>
  <div class="table-information-container">
    <div class="table-header">
      <h3>数据表信息</h3>
      <div class="header-buttons">
        <el-button
          type="info"
          :icon="RefreshLeft"
          :disabled="!hasDeletedData"
          @click="handleRestore"
        >
          还原数据
        </el-button>
        <el-button
          type="primary"
          :icon="Edit"
          :disabled="isModifyDisabled"
          @click="handleModifyTableInfo"
        >
          修改表信息
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="loadAllTables"
        >
          刷新表列表
        </el-button>
      </div>
    </div>

    <div class="table-content">
      <el-table
        ref="tableRef"
        :data="filteredTables"
        style="width: 100%"
        height="100%"
        v-loading="loading"
        empty-text="暂无数据表"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        :row-style="{ cursor: 'pointer' }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="tableName"
          label="表名"
          width="200"
        >
          <template #default="scope">
            <span v-html="highlightText(scope.row.tableName)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tableComment"
          label="表描述"
        >
          <template #default="scope">
            <span v-html="highlightText(scope.row.tableComment || '')"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rowCount"
          label="记录数"
          width="120"
        />
      </el-table>
    </div>

    <!-- 修改表信息对话框 -->
    <el-dialog
      v-model="modifyDialogVisible"
      title="修改表信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="modifyForm" label-width="80px">
        <el-form-item label="表名">
          <el-input v-model="modifyForm.tableName" placeholder="留空则不修改表名" />
        </el-form-item>
        <el-form-item label="表描述">
          <el-input v-model="modifyForm.tableComment" type="textarea" placeholder="留空则不修改表描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModify">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { RefreshLeft, Edit } from '@element-plus/icons-vue';
  import { getAllTables, updateTableInfo } from '@/api/data-management';
  import type { TableInfo } from '@/api/data-management';

  // 定义事件
  const emit = defineEmits<{
    loaded: []
    viewDetail: [tableName: string, rowCount?: number]
    selectionChange: [rows: TableInfo[]]
  }>();

  // 定义props
  const props = defineProps<{
    searchKeyword?: string
  }>();

  // 表数据
  const tables = ref<TableInfo[]>([]);
  const originalTables = ref<TableInfo[]>([]);
  const deletedTables = ref<TableInfo[]>([]);
  const loading = ref(false);
  const tableRef = ref();

  // 修改对话框
  const modifyDialogVisible = ref(false);
  const modifyForm = ref({
    tableName: '',
    tableComment: ''
  });
  const selectedTable = ref<TableInfo | null>(null);

  // 是否有已删除的数据
  const hasDeletedData = computed(() => {
    return deletedTables.value.length > 0;
  });

  // 修改按钮是否禁用（只能选中一条）
  const isModifyDisabled = computed(() => {
    return tables.value.length === 0;
  });

  // 计算过滤后的表格数据
  const filteredTables = computed(() => {
    if (!props.searchKeyword || props.searchKeyword.trim() === '') {
      return tables.value;
    }

    const keyword = props.searchKeyword.toLowerCase().trim();
    return tables.value.filter(table => {
      const tableName = (table.tableName || '').toLowerCase();
      const tableComment = (table.tableComment || '').toLowerCase();
      return tableName.includes(keyword) || tableComment.includes(keyword);
    });
  });

  // 高亮文本
  const highlightText = (text: string) => {
    if (!props.searchKeyword || props.searchKeyword.trim() === '' || !text) {
      return text;
    }

    const keyword = props.searchKeyword.trim();
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  // 加载所有表
  const loadAllTables = async () => {
    loading.value = true;
    try {
      const response = await getAllTables();
      if (response.code === 200) {
        const data = response.data || [];
        originalTables.value = JSON.parse(JSON.stringify(data));
        tables.value = data;
        deletedTables.value = [];
        ElMessage.success('表列表加载成功');
        emit('loaded');
      } else {
        ElMessage.error(response.message || '获取表列表失败');
      }
    } catch (error) {
      console.error('加载表列表失败:', error);
      ElMessage.error('加载表列表失败');
    } finally {
      loading.value = false;
    }
  };

  // 删除表
  const deleteTables = (tablesToDelete: TableInfo[]) => {
    tables.value = tables.value.filter(table => {
      const shouldDelete = tablesToDelete.some(t => t.tableName === table.tableName);
      if (shouldDelete) {
        deletedTables.value.push(table);
      }
      return !shouldDelete;
    });
  };

  // 还原数据
  const handleRestore = async () => {
    try {
      await ElMessageBox.confirm(
        `确定要还原 ${deletedTables.value.length} 条已删除的数据吗？`,
        '还原确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }
      );

      tables.value = [...tables.value, ...deletedTables.value];
      deletedTables.value = [];
      ElMessage.success('数据还原成功');
    } catch {
      // 用户取消操作
    }
  };

  // 打开修改表信息对话框
  const handleModifyTableInfo = () => {
    if (!selectedTable.value) {
      ElMessage.warning('请先选中一条要修改的表');
      return;
    }
    modifyForm.value = {
      tableName: '',
      tableComment: selectedTable.value.tableComment || ''
    };
    modifyDialogVisible.value = true;
  };

  // 确认修改表信息
  const confirmModify = async () => {
    if (!selectedTable.value) return;

    if (!modifyForm.value.tableName && !modifyForm.value.tableComment) {
      ElMessage.warning('请至少修改一项');
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要修改表 "${selectedTable.value.tableName}" 的信息吗？`,
        '确认修改',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );

      const response = await updateTableInfo(
        selectedTable.value.tableName,
        modifyForm.value.tableName || undefined,
        modifyForm.value.tableComment || undefined
      );

      if (response.code === 200) {
        ElMessage.success('修改成功');
        modifyDialogVisible.value = false;
        // 重新加载表列表
        await loadAllTables();
      } else {
        ElMessage.error(response.message || '修改失败');
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('修改表信息失败:', error);
      }
    }
  };

  // 行点击事件 - 显示表详情
  const handleRowClick = (row: TableInfo) => {
    console.log('点击行查看表详情:', row);
    emit('viewDetail', row.tableName, row.rowCount);
  };

  // 选中变化事件
  const handleSelectionChange = (rows: TableInfo[]) => {
    emit('selectionChange', rows);
    // 保存当前选中的表
    if (rows.length === 1) {
      selectedTable.value = rows[0];
    } else {
      selectedTable.value = null;
    }
  };

  // 清除选中
  const clearSelection = () => {
    tableRef.value?.clearSelection();
    selectedTable.value = null;
  };

  // 组件挂载时加载表列表
  onMounted(() => {
    loadAllTables();
  });

  // 暴露方法给父组件
  defineExpose({
    clearSelection,
    deleteTables
  });
</script>

<style scoped>
  .table-information-container {
    background-color: rgba(15, 61, 118, 0.8);
    margin: 0;
    color: white;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    flex-shrink: 0;
  }

  .header-buttons {
    display: flex;
    gap: 10px;
  }

  .table-header h3 {
    margin: 0;
    color: white;
  }

  .table-content {
    flex: 1;
    overflow: hidden;
    padding: 0 20px 20px 20px;
  }

  /* 高亮样式 */
  :deep(.highlight) {
    color: #ff6b6b;
    font-weight: bold;
    background-color: rgba(255, 107, 107, 0.2);
    padding: 2px 4px;
    border-radius: 3px;
  }

  /* Element Plus 表格样式定制 */
  :deep(.el-table) {
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: rgba(86, 204, 242, 0.3);
    --el-table-text-color: white;
    --el-table-header-text-color: white;
    --el-table-row-hover-bg-color: rgba(86, 204, 242, 0.2);
    --el-table-border-color: rgba(255, 255, 255, 0.2);
  }

  :deep(.el-table th) {
    background-color: rgba(86, 204, 242, 0.3) !important;
    color: white !important;
  }

  :deep(.el-table td) {
    color: white !important;
  }

  :deep(.el-table--border th) {
    background: linear-gradient(
      180deg,
      rgb(86, 204, 242) 0%,
      rgb(47, 128, 237) 100%
    );
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  :deep(.el-table__empty-text) {
    color: rgba(255, 255, 255, 0.5);
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }
</style>
