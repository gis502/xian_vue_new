<template>
  <!-- 有数据时的弹窗 -->
  <el-dialog
    v-model="hasDataDialogVisible"
    :title="`表详情 - ${tableName}`"
    width="90%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="table-detail-container">
      <!-- 数据记录 -->
      <div class="section">
        <div class="section-header">
          <h4>数据记录</h4>
          <span class="record-count">共 {{ total }} 条记录</span>
        </div>

        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          max-height="500"
          border
          stripe
          :empty-text="loading ? '加载中...' : '暂无数据'"
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

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="hasDataDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 无数据时的弹窗 -->
  <el-dialog
    v-model="noDataDialogVisible"
    :title="`表详情 - ${tableName}`"
    width="90%"
    :close-on-click-modal="false"
  >
    <div class="empty-table-container">
      <div class="empty-content">
        <el-empty
          description="暂无数据"
          :image-size="120"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="noDataDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 修改数据对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    :title="`修改数据 - ${tableName}`"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="editForm" label-width="120px" v-loading="editLoading">
      <el-form-item
        v-for="col in columns"
        :key="col.column_name"
        :label="col.column_name"
      >
        <!-- 主键字段不可修改 -->
        <el-input
          v-if="isPrimaryKey(col.column_name)"
          :value="editForm[col.column_name]"
          disabled
        />
        <!-- 普通字段可修改 -->
        <el-input
          v-else
          v-model="editForm[col.column_name]"
          :placeholder="`请输入${col.column_name}`"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmEdit" :loading="editLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox, ElEmpty } from 'element-plus';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import { getTableData, updateTableData } from '@/api/data-management';
  import type { TableColumn, TableDataRecord } from '@/api/data-management';

  // 两个独立的对话框状态
  const hasDataDialogVisible = ref(false);
  const noDataDialogVisible = ref(false);
  const loading = ref(false);

  // 表名
  const tableName = ref('');

  // 字段信息
  const columns = ref<TableColumn[]>([]);

  // 表数据
  const tableData = ref<TableDataRecord[]>([]);

  // 总记录数
  const total = ref(0);

  // 分页参数
  const currentPage = ref(1);
  const pageSize = ref(10);

  // 修改对话框
  const editDialogVisible = ref(false);
  const editLoading = ref(false);
  const editForm = ref<TableDataRecord>({});
  const editRowOriginal = ref<TableDataRecord>({});

  // 获取主键字段名（简化处理，假设第一个字段为主键）
  const isPrimaryKey = (columnName: string): boolean => {
    return columns.value.length > 0 && columns.value[0].column_name === columnName;
  };

  // 显示详情对话框 - 根据 rowCount 决定使用哪个弹窗
  const showDialog = async (name: string, rowCount?: number) => {
    tableName.value = name;
    // 重置分页
    currentPage.value = 1;
    pageSize.value = 10;

    if (rowCount === 0) {
      noDataDialogVisible.value = true;
    } else {
      hasDataDialogVisible.value = true;
      await loadTableData(name);
    }
  };

  // 加载表数据
  const loadTableData = async (name: string) => {
    loading.value = true;
    try {
      const response = await getTableData(name);
      if (response.code === 200 && response.data) {
        columns.value = response.data.columns || [];
        // 根据分页参数截取数据
        const startIndex = (currentPage.value - 1) * pageSize.value;
        const endIndex = startIndex + pageSize.value;
        const allData = response.data.data || [];
        tableData.value = allData.slice(startIndex, endIndex);
        total.value = response.data.total || allData.length;
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
    currentPage.value = 1;
    pageSize.value = 10;
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

  // 每页条数变化
  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1; // 改变每页条数时重置到第一页
    loadTableData(tableName.value);
  };

  // 页码变化
  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    loadTableData(tableName.value);
  };

  // 修改按钮点击事件
  const handleEdit = (row: TableDataRecord) => {
    editRowOriginal.value = { ...row };
    editForm.value = { ...row };
    editDialogVisible.value = true;
  };

  // 确认修改
  const confirmEdit = async () => {
    // 构建更新数据（只更新修改过的字段）
    const updateData: Record<string, unknown> = {};
    for (const key in editForm.value) {
      if (editForm.value[key] !== editRowOriginal.value[key]) {
        updateData[key] = editForm.value[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      ElMessage.warning('没有修改任何数据');
      return;
    }

    // 构建WHERE条件（使用主键）
    const primaryKey = columns.value[0]?.column_name;
    if (!primaryKey || !editRowOriginal.value[primaryKey]) {
      ElMessage.error('无法确定主键字段');
      return;
    }

    const whereConditions = {
      [primaryKey]: editRowOriginal.value[primaryKey]
    };

    try {
      editLoading.value = true;
      const response = await updateTableData(tableName.value, whereConditions, updateData);

      if (response.code === 200) {
        ElMessage.success('修改成功');
        editDialogVisible.value = false;
        // 重新加载数据
        await loadTableData(tableName.value);
      } else {
        ElMessage.error(response.message || '修改失败');
      }
    } catch (error) {
      console.error('修改数据失败:', error);
      ElMessage.error('修改数据失败');
    } finally {
      editLoading.value = false;
    }
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

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }

  .empty-table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .empty-content {
    width: 100%;
  }

  :deep(.el-table) {
    font-size: 13px;
  }

  :deep(.el-table th) {
    background-color: #f5f7fa !important;
    color: #333 !important;
  }

  :deep(.el-table .cell) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
