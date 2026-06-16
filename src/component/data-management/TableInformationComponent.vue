<template>
  <div class="table-information-container">
    <div class="table-header">
      <h3>数据表信息</h3>
      <div class="header-buttons">
        <el-button
          type="success"
          :icon="Download"
          :loading="exporting"
          :disabled="exporting || progressVisible"
          @click="handleExport"
        >
          {{ exporting && !progressVisible ? '导出中…' : '导出数据' }}
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
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        >
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        >
          <template #default="scope">
            {{ formatDateTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
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

<el-dialog
      v-model="progressVisible"
      :title="'导出进度 - ' + progressTableName"
      width="480px"
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeProgress"
    >
      <div class="progress-container">
        <div class="progress-status">
          <el-tag v-if="progressStatus === 'PENDING'" type="info">等待中</el-tag>
          <el-tag v-else-if="progressStatus === 'RUNNING'" type="warning">导出中</el-tag>
          <el-tag v-else-if="progressStatus === 'COMPLETED'" type="success">已完成</el-tag>
          <el-tag v-else-if="progressStatus === 'FAILED'" type="danger">失败</el-tag>
        </div>
        <div class="progress-info" style="margin: 8px 0; font-size: 14px;">
          <span v-if="progressStatus === 'RUNNING' || progressStatus === 'COMPLETED'">
            已导出 {{ progressProcessed.toLocaleString() }} / {{ progressTotal.toLocaleString() }} 行
            <template v-if="progressTotal > 0">
              （{{ ((progressProcessed / progressTotal) * 100).toFixed(1) }}%）
            </template>
          </span>
          <span v-else-if="progressStatus === 'PENDING'">任务已提交，等待执行...</span>
        </div>
        <el-progress
          v-if="progressStatus === 'RUNNING' && progressTotal > 0"
          :percentage="Math.round((progressProcessed / progressTotal) * 100)"
          :stroke-width="20"
          :text-inside="true"
          style="margin: 16px 0"
        />
        <el-alert
          v-if="progressStatus === 'FAILED'"
          title="导出失败"
          :description="progressError || '未知错误'"
          type="error" show-icon :closable="false" style="margin-top: 12px"
        />
        <el-alert
          v-if="progressStatus === 'COMPLETED'"
          title="导出完成，正在触发下载..."
          type="success" show-icon :closable="false" style="margin-top: 12px"
        />
      </div>
      <template #footer>
        <el-button @click="closeProgress">
          {{ progressStatus === 'RUNNING' || progressStatus === 'PENDING' ? '后台运行' : '关闭' }}
        </el-button>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { RefreshLeft, Download } from '@element-plus/icons-vue';
  import { getAllTables, updateTableInfo } from '@/api/data-management';
  import type { TableInfo } from '@/api/data-management';

  // 定义事件
  const emit = defineEmits<{
    loaded: []
    viewDetail: [tableName: string, rowCount?: number]
    selectionChange: [rows: TableInfo[]]
  }>();

  const ASYNC_THRESHOLD = 10000;
  const POLL_INTERVAL_MS = 3000;
  const SYNC_TIMEOUT_MS = 60000;

  // 定义props
  const props = defineProps<{
    searchKeyword?: string
  }>();

  // 表数据
  const tables = ref<TableInfo[]>([]);
  const originalTables = ref<TableInfo[]>([]);
  const deletedTables = ref<TableInfo[]>([]);
  const loading = ref(false);
  const exporting = ref(false);
  const tableRef = ref();

  // 修改对话框
  const modifyDialogVisible = ref(false);
  const modifyForm = ref({
    tableName: '',
    tableComment: ''
  });
  const selectedTable = ref<TableInfo | null>(null);
  const selectedRows = ref<TableInfo[]>([]);

  const progressVisible = ref(false);
  const progressTableName = ref('');
  const progressStatus = ref('');
  const progressTotal = ref(0);
  const progressProcessed = ref(0);
  const progressError = ref('');
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  // 是否有已删除的数据
  const hasDeletedData = computed(() => {
    return deletedTables.value.length > 0;
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

  // 行点击事件 - 显示表详情
  const handleRowClick = (row: TableInfo) => {
    console.log('点击行查看表详情:', row);
    emit('viewDetail', row.tableName, row.rowCount);
  };

  // 选中变化事件
  const handleSelectionChange = (rows: TableInfo[]) => {
    emit('selectionChange', rows);
    selectedRows.value = rows;
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
    selectedRows.value = [];

  };

  // 打开修改表信息对话框（由父组件调用）
  const handleModifySelected = () => {
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
    } catch (error: unknown) {
      if (error !== 'cancel') {
        console.error('修改表信息失败:', error);
      }
    }
  };

  const handleExport = async () => {
    if (selectedRows.value.length === 0) { ElMessage.warning('请先勾选要导出的数据表'); return; }
    if (selectedRows.value.length > 1) { ElMessage.warning('一次只能导出一张表'); return; }
    const table = selectedRows.value[0];
    const rowCount = table.rowCount || 0;
    if (rowCount >= ASYNC_THRESHOLD) {
      await startAsyncExport(table.tableName);
    } else {
      await startSyncDownload(table.tableName);
    }
  };

  const startSyncDownload = async (tableName: string) => {
    exporting.value = true;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
      const response = await fetch('/api/export/' + encodeURIComponent(tableName), { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || '导出失败');
      }
      const blob = await response.blob();
      triggerDownload(blob, tableName + '.csv');
      ElMessage.success('表导出完成');
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        ElMessage.error('导出超时（60秒），请使用大表导出或刷新后重试');
      } else {
        console.error('导出失败:', error);
        ElMessage.error(error instanceof Error ? error.message : '导出失败');
      }
    } finally { exporting.value = false; }
  };

  const startAsyncExport = async (tableName: string) => {
    exporting.value = true;
    try {
      const response = await fetch('/api/export/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName })
      });
      const result = await response.json();
      const data = result.data || result;
      if (!response.ok || (result.code && result.code !== 200)) {
        throw new Error(data.message || result.message || '提交导出任务失败');
      }
      const taskId = data.taskId;
      if (!taskId) throw new Error('未获取到任务ID');
      progressTableName.value = tableName;
      progressStatus.value = 'PENDING';
      progressTotal.value = data.totalRows || 0;
      progressProcessed.value = 0;
      progressError.value = '';
      progressVisible.value = true;
      exporting.value = false;
      pollTimer = setInterval(() => pollProgress(taskId, tableName), POLL_INTERVAL_MS);
      pollProgress(taskId, tableName);
    } catch (error: unknown) {
      console.error('提交导出任务失败:', error);
      ElMessage.error(error instanceof Error ? error.message : '提交导出任务失败');
      exporting.value = false;
    }
  };

  const pollProgress = async (taskId: number, tableName: string) => {
    if (!taskId) return;
    try {
      const response = await fetch('/api/export/progress/' + taskId);
      if (!response.ok) return;
      const text = await response.text();
      let result: any;
      try { result = JSON.parse(text); } catch { return; }
      const data = result.data || result;
      progressStatus.value = data.status;
      progressProcessed.value = data.processedRows || 0;
      progressTotal.value = data.totalRows || progressTotal.value;
      progressError.value = data.errorMessage || '';
      if (data.status === 'COMPLETED') {
        stopPolling();
        progressStatus.value = 'COMPLETED';
        ElMessage.success('表 ' + tableName + ' 导出完成，正在下载...');
        setTimeout(() => { triggerDownloadByUrl('/api/export/download/' + taskId, tableName + '.csv'); }, 500);
      } else if (data.status === 'FAILED') {
        stopPolling();
        progressStatus.value = 'FAILED';
        progressError.value = data.errorMessage || '';
        ElMessage.error('导出失败: ' + (data.errorMessage || '未知错误'));
      }
    } catch (e) { console.error('轮询异常:', e); }
  };

  const stopPolling = () => { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } };
  const closeProgress = () => { progressVisible.value = false; };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); window.URL.revokeObjectURL(url);
  };

  const triggerDownloadByUrl = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link);
  };

  // 组件挂载时加载表列表
  onMounted(() => { loadAllTables(); });
  onUnmounted(() => { stopPolling(); });

  // 暴露方法给父组件
  defineExpose({
    clearSelection,
    deleteTables,
    handleModifySelected
  });

  // 格式化日期时间
  const formatDateTime = (dateTime?: string): string => {
    if (!dateTime) {
      return '-';
    }
    try {
      // 处理ISO 8601格式
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        return '-';
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return '-';
    }
  };

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
