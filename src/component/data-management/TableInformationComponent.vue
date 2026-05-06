<template>
  <div class="table-information-container">
    <div class="table-header">
      <h3>数据表信息</h3>
      <el-button
        type="primary"
        :loading="loading"
        @click="loadAllTables"
      >
        刷新表列表
      </el-button>
    </div>

    <div class="table-content">
      <el-table
        ref="tableRef"
        :data="filteredTables"
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无数据表"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
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
          label="操作"
          width="120"
        >
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click.stop="viewTableDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getAllTables } from '@/api/data-management';
  import type { TableInfo } from '@/api/data-management';

  // 定义事件
  const emit = defineEmits<{
    loaded: []
    viewDetail: [tableName: string]
    selectionChange: [selectedRows: TableInfo[]]
  }>();

  // 定义props
  const props = defineProps<{
    searchKeyword?: string
  }>();

  // 表数据
  const tables = ref<TableInfo[]>([]);
  const loading = ref(false);
  const tableRef = ref();
  const selectedRows = ref<TableInfo[]>([]);

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
        tables.value = response.data || [];
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

  // 行点击事件
  const handleRowClick = (row: TableInfo) => {
    console.log('点击行:', row);
  };

  // 选中变化事件
  const handleSelectionChange = (selection: TableInfo[]) => {
    selectedRows.value = selection;
    emit('selectionChange', selection);
  };

  // 查看表详情
  const viewTableDetail = (table: TableInfo) => {
    console.log('查看表详情:', table);
    // 触发事件，通知父组件显示详情
    emit('viewDetail', table.tableName);
  };

  // 清空选中
  const clearSelection = () => {
    tableRef.value?.clearSelection();
  };

  // 组件挂载时加载表列表
  onMounted(() => {
    loadAllTables();
  });

  // 暴露方法给父组件
  defineExpose({
    clearSelection,
    loadAllTables
  });
</script>

<style scoped>
  .table-information-container {
    padding: 20px;
    background-color: rgba(15, 61, 118, 0.8);
    border-radius: 8px;
    margin: 0 20px 20px 20px;
    color: white;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .table-header h3 {
    margin: 0;
    color: white;
  }

  .table-content {
    min-height: 300px;
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
</style>
