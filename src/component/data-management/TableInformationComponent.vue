<template>
  <div class="table-information-container">
    <div class="table-header">
      <h3>数据表信息</h3>
      <div class="header-buttons">
        <el-button
          type="success"
          :icon="Download"
          :loading="exporting"
          :disabled="exporting"
          @click="handleExport"
        >
          {{ exporting ? '导出中…' : '导出数据' }}
        </el-button>
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
        <el-table-column prop="tableName" label="表名" width="200">
          <template #default="scope">
            <span v-html="highlightText(scope.row.tableName)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="tableComment" label="表描述">
          <template #default="scope">
            <span v-html="highlightText(scope.row.tableComment || '')"></span>
          </template>
        </el-table-column>
        <el-table-column prop="rowCount" label="记录数" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

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
  import { RefreshLeft, Download } from '@element-plus/icons-vue';
  import { getAllTables, updateTableInfo } from '@/api/data-management';
  import type { TableInfo } from '@/api/data-management';

  const emit = defineEmits<{
    loaded: []
    viewDetail: [tableName: string, rowCount?: number]
    selectionChange: [rows: TableInfo[]]
  }>();

  const props = defineProps<{ searchKeyword?: string }>();

  const tables = ref<TableInfo[]>([]);
  const originalTables = ref<TableInfo[]>([]);
  const deletedTables = ref<TableInfo[]>([]);
  const loading = ref(false);
  const exporting = ref(false);
  const tableRef = ref();

  const modifyDialogVisible = ref(false);
  const modifyForm = ref({ tableName: '', tableComment: '' });
  const selectedTable = ref<TableInfo | null>(null);
  const selectedRows = ref<TableInfo[]>([]);

  const hasDeletedData = computed(() => deletedTables.value.length > 0);

  const filteredTables = computed(() => {
    if (!props.searchKeyword?.trim()) return tables.value;
    const keyword = props.searchKeyword.toLowerCase().trim();
    return tables.value.filter(t => {
      const name = (t.tableName || '').toLowerCase();
      const comment = (t.tableComment || '').toLowerCase();
      return name.includes(keyword) || comment.includes(keyword);
    });
  });

  const highlightText = (text: string) => {
    if (!props.searchKeyword?.trim() || !text) return text;
    const regex = new RegExp(`(${props.searchKeyword.trim()})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const loadAllTables = async () => {
    loading.value = true;
    try {
      const response = await getAllTables();
      if (response.code === 200) {
        const data = response.data || [];
        originalTables.value = JSON.parse(JSON.stringify(data));
        tables.value = data;
        deletedTables.value = [];
        emit('loaded');
      } else {
        ElMessage.error(response.message || '获取表列表失败');
      }
    } catch (error) {
      console.error('加载表列表失败:', error);
      ElMessage.error('加载表列表失败');
    } finally { loading.value = false; }
  };

  const deleteTables = (tablesToDelete: TableInfo[]) => {
    tables.value = tables.value.filter(table => {
      const shouldDelete = tablesToDelete.some(t => t.tableName === table.tableName);
      if (shouldDelete) deletedTables.value.push(table);
      return !shouldDelete;
    });
  };

  const handleRestore = async () => {
    try {
      await ElMessageBox.confirm(
        `确定要还原 ${deletedTables.value.length} 条已删除的数据吗？`, '还原确认',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
      );
      tables.value = [...tables.value, ...deletedTables.value];
      deletedTables.value = [];
      ElMessage.success('数据还原成功');
    } catch {}
  };

  const handleRowClick = (row: TableInfo) => {
    emit('viewDetail', row.tableName, row.rowCount);
  };

  const handleSelectionChange = (rows: TableInfo[]) => {
    emit('selectionChange', rows);
    selectedRows.value = rows;
    selectedTable.value = rows.length === 1 ? rows[0] : null;
  };

  const clearSelection = () => {
    tableRef.value?.clearSelection();
    selectedTable.value = null;
    selectedRows.value = [];
  };

  const handleModifySelected = () => {
    if (!selectedTable.value) { ElMessage.warning('请先选中一条要修改的表'); return; }
    modifyForm.value = { tableName: '', tableComment: selectedTable.value.tableComment || '' };
    modifyDialogVisible.value = true;
  };

  const confirmModify = async () => {
    if (!selectedTable.value) return;
    if (!modifyForm.value.tableName && !modifyForm.value.tableComment) {
      ElMessage.warning('请至少修改一项'); return;
    }
    try {
      await ElMessageBox.confirm(
        `确定要修改表 "${selectedTable.value.tableName}" 的信息吗？`, '确认修改',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      );
      const response = await updateTableInfo(
        selectedTable.value.tableName,
        modifyForm.value.tableName || undefined,
        modifyForm.value.tableComment || undefined
      );
      if (response.code === 200) {
        ElMessage.success('修改成功');
        modifyDialogVisible.value = false;
        await loadAllTables();
      } else {
        ElMessage.error(response.message || '修改失败');
      }
    } catch (error: unknown) { if (error !== 'cancel') console.error('修改表信息失败:', error); }
  };

  const handleExport = async () => {
    if (selectedRows.value.length === 0) { ElMessage.warning('请先勾选要导出的数据表'); return; }
    if (selectedRows.value.length > 1) { ElMessage.warning('一次只能导出一张表'); return; }
    const tableName = selectedRows.value[0].tableName;
    exporting.value = true;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const response = await fetch('/api/export/' + encodeURIComponent(tableName), { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || '导出失败');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = tableName + '.csv';
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); window.URL.revokeObjectURL(url);
      ElMessage.success('导出完成');
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        ElMessage.error('导出超时（120秒），请刷新后重试');
      } else {
        console.error('导出失败:', error);
        ElMessage.error(error instanceof Error ? error.message : '导出失败');
      }
    } finally { exporting.value = false; }
  };

  const formatDateTime = (dateTime?: string): string => {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '-';
      const y = date.getFullYear();
      const mo = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
    } catch { return '-'; }
  };

  onMounted(() => { loadAllTables(); });

  defineExpose({ clearSelection, deleteTables, handleModifySelected });
</script>

<style scoped>
  .table-information-container {
    background-color: rgba(15, 61, 118, 0.8); margin: 0; color: white;
    flex: 1; display: flex; flex-direction: column; overflow: hidden;
  }
  .table-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px; flex-shrink: 0;
  }
  .header-buttons { display: flex; gap: 10px; }
  .table-header h3 { margin: 0; color: white; }
  .table-content { flex: 1; overflow: hidden; padding: 0 20px 20px 20px; }
  :deep(.highlight) {
    color: #ff6b6b; font-weight: bold;
    background-color: rgba(255, 107, 107, 0.2); padding: 2px 4px; border-radius: 3px;
  }
  :deep(.el-table) {
    --el-table-bg-color: transparent; --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: rgba(86, 204, 242, 0.3);
    --el-table-text-color: white; --el-table-header-text-color: white;
    --el-table-row-hover-bg-color: rgba(86, 204, 242, 0.2);
    --el-table-border-color: rgba(255, 255, 255, 0.2);
  }
  :deep(.el-table th) { background-color: rgba(86, 204, 242, 0.3) !important; color: white !important; }
  :deep(.el-table td) { color: white !important; }
  :deep(.el-table--border th) {
    background: linear-gradient(180deg, rgb(86, 204, 242) 0%, rgb(47, 128, 237) 100%);
    color: white; border: 1px solid rgba(255, 255, 255, 0.3);
  }
  :deep(.el-table__empty-text) { color: rgba(255, 255, 255, 0.5); }
  :deep(.el-table__inner-wrapper::before) { display: none; }
</style>
