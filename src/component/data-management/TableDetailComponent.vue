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
          <div class="title-with-actions">
            <h4>数据记录</h4>
            <div class="header-actions">
              <el-button type="success" :icon="Plus" @click="handleAdd">
                新增
              </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="selectedRows.length === 0"
                @click="handleBatchDelete"
              >
                删除 ({{ selectedRows.length }})
              </el-button>
              <el-button
                type="primary"
                :icon="Edit"
                :disabled="selectedRows.length !== 1"
                @click="handleBatchEdit"
              >
                修改
              </el-button>
            </div>
          </div>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" fixed="left" />

          <el-table-column
            v-for="col in columns"
            :key="col.column_name"
            :prop="col.column_name"
            :label="col.column_name"
            :min-width="getColumnWidth(col)"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ formatCell(row[col.column_name], col) }}
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
    :title="`${isBatchEdit ? '批量修改' : '修改数据'} - ${tableName}`"
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

  <!-- 新增数据对话框 -->
  <el-dialog
    v-model="addDialogVisible"
    :title="`新增数据 - ${tableName}`"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="addForm" label-width="120px" v-loading="addLoading">
      <el-form-item
        v-for="col in columns"
        :key="col.column_name"
        :label="col.column_name"
      >
        <!-- 主键字段（id）自动生成，不显示 -->
        <el-input
          v-if="isPrimaryKey(col.column_name)"
          value="自动生成"
          disabled
        />
        <!-- geom 字段：隐藏，由经纬度计算 -->
        <el-input
          v-else-if="isGeometryField(col.column_name, col.data_type)"
          value="由经纬度自动生成"
          disabled
        />
        <!-- create_time 字段：自动填充当前时间 -->
        <el-input
          v-else-if="isCreateTimeField(col.column_name)"
          :value="getCurrentDateTime()"
          disabled
        />
        <!-- update_time 字段：自动填充当前时间 -->
        <el-input
          v-else-if="isUpdateTimeField(col.column_name)"
          :value="getCurrentDateTime()"
          disabled
        />
        <!-- is_delete 字段：默认为 0 -->
        <el-input
          v-else-if="col.column_name === 'is_delete'"
          value="0"
          disabled
        />
        <!-- 普通字段可输入 -->
        <el-input
          v-else
          v-model="addForm[col.column_name]"
          :placeholder="getPlaceholder(col)"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmAdd" :loading="addLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox, ElEmpty } from 'element-plus';
  import { Edit, Delete, Plus } from '@element-plus/icons-vue';
  import { getTableData, updateTableData, insertTableData, deleteTableData } from '@/api/data-management';
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

  // 选中的行
  const selectedRows = ref<TableDataRecord[]>([]);

  // 修改对话框
  const editDialogVisible = ref(false);
  const editLoading = ref(false);
  const editForm = ref<TableDataRecord>({});
  const editRowOriginal = ref<TableDataRecord>({});
  const isBatchEdit = ref(false);

  // 新增对话框
  const addDialogVisible = ref(false);
  const addLoading = ref(false);
  const addForm = ref<TableDataRecord>({});

  // 获取主键字段名（简化处理，假设第一个字段为主键）
  const isPrimaryKey = (columnName: string): boolean => {
    return columns.value.length > 0 && columns.value[0].column_name === columnName;
  };

  // 判断是否为几何字段
  const isGeometryField = (columnName: string, dataType?: string): boolean => {
    return columnName === 'geom' ||
           (typeof dataType === 'string' && dataType.toLowerCase().includes('geometry'));
  };

  // 判断是否为创建时间字段
  const isCreateTimeField = (columnName: string): boolean => {
    return columnName === 'create_time';
  };

  // 判断是否为更新时间字段
  const isUpdateTimeField = (columnName: string): boolean => {
    return columnName === 'update_time';
  };

  // 获取当前日期时间字符串
  const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 获取输入框占位符
  const getPlaceholder = (col: TableColumn): string => {
    const dataType = typeof col.data_type === 'string' ? col.data_type.toLowerCase() : '';

    if (dataType.includes('int')) {
      return `请输入${col.column_name}（整数）`;
    }
    if (dataType.includes('float') || dataType.includes('double') || dataType.includes('numeric')) {
      return `请输入${col.column_name}（数字）`;
    }
    if (dataType.includes('timestamp') || dataType.includes('date')) {
      return `请输入${col.column_name}（如：2026-01-01 12:00:00）`;
    }
    return `请输入${col.column_name}`;
  };

  // 显示详情对话框 - 根据 rowCount 决定使用哪个弹窗
  const showDialog = async (name: string, rowCount?: number) => {
    tableName.value = name;
    // 重置分页
    currentPage.value = 1;
    pageSize.value = 10;
    // 重置选中行
    selectedRows.value = [];

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
      const response = await getTableData(name, currentPage.value, pageSize.value);
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
    currentPage.value = 1;
    pageSize.value = 10;
    selectedRows.value = [];
  };

  // 根据数据类型设置列宽度
  const getColumnWidth = (col: TableColumn): number | undefined => {
    if (!col || !col.data_type) return undefined;

    const dataType = typeof col.data_type === 'string' ? col.data_type : String(col.data_type);

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

  // 选择变化
  const handleSelectionChange = (selection: TableDataRecord[]) => {
    selectedRows.value = selection;
  };

  // 新增按钮点击事件
  const handleAdd = () => {
    // 初始化新增表单，所有字段设为空字符串
    addForm.value = {};
    columns.value.forEach(col => {
      if (!isPrimaryKey(col.column_name)) {
        // 特殊字段自动填充
        if (col.column_name === 'is_delete') {
          addForm.value[col.column_name] = '0';
        } else if (col.column_name === 'create_time' || col.column_name === 'update_time') {
          addForm.value[col.column_name] = getCurrentDateTime();
        } else if (isGeometryField(col.column_name, col.data_type)) {
          // geom 字段不添加到表单
        } else {
          addForm.value[col.column_name] = '';
        }
      }
    });
    addDialogVisible.value = true;
  };

  // 确认新增
  const confirmAdd = async () => {
    // 校验必填字段（这里简单校验，实际可根据数据库字段约束调整）
    const emptyFields: string[] = [];
    columns.value.forEach(col => {
      // 跳过特殊字段
      if (isPrimaryKey(col.column_name) ||
          isGeometryField(col.column_name, col.data_type) ||
          col.column_name === 'create_time' ||
          col.column_name === 'update_time' ||
          col.column_name === 'is_delete') {
        return;
      }

      if (!col.is_nullable?.includes('YES') &&
          (!addForm.value[col.column_name] ||
           String(addForm.value[col.column_name] ?? '').trim() === '')) {
        emptyFields.push(col.column_name);
      }
    });

    if (emptyFields.length > 0) {
      ElMessage.warning(`请填写必填字段: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      addLoading.value = true;

      // 过滤掉空值字段和特殊字段
      const filteredData: Record<string, unknown> = {};
      for (const key in addForm.value) {
        const value = addForm.value[key];

        // 跳过特殊字段
        if (key === 'geom' || isGeometryField(key, undefined)) {
          continue;
        }

        // 只保留非空值
        if (value !== null && value !== undefined && value.toString().trim() !== '') {
          // 类型转换
          if (key === 'is_delete') {
            filteredData[key] = 0;  // 转换为整数
          } else {
            filteredData[key] = value;
          }
        }
      }

      // 调用新增API
      const response = await insertTableData(tableName.value, filteredData);

      if (response.code === 200) {
        ElMessage.success('新增成功');
        addDialogVisible.value = false;

        // 重新加载数据（回到第一页）
        currentPage.value = 1;
        await loadTableData(tableName.value);
      } else {
        ElMessage.error(response.message || '新增失败');
      }
    } catch (error: unknown) {
      console.error('新增数据失败:', error);
      // 显示详细错误信息
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = err.response?.data?.message || err.message || '新增数据失败';
      ElMessage.error(errorMsg);
    } finally {

    }
  };

  // 批量删除按钮点击事件
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请先选择要删除的记录');
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 条记录吗？此操作不可恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      // 获取所有选中行的主键
      const primaryKey = columns.value[0]?.column_name;
      if (!primaryKey) {
        ElMessage.error('无法确定主键字段');
        return;
      }

      const ids = selectedRows.value
        .map(row => row[primaryKey])
        .filter((id): id is string | number => id != null && typeof id !== 'boolean');

      if (ids.length === 0) {
        ElMessage.error('未获取到有效的主键值');
        return;
      }

      // 调用删除API
      loading.value = true;
      const response = await deleteTableData(tableName.value, ids);

      if (response.code === 200) {
        ElMessage.success(`成功删除 ${ids.length} 条记录`);
        // 清空选中项
        selectedRows.value = [];
        // 重新加载数据
        await loadTableData(tableName.value);
      } else {
        ElMessage.error(response.message || '删除失败');
      }
    } catch (error: unknown) {
      if (error !== 'cancel') {
        console.error('删除数据失败:', error);
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMsg = err.response?.data?.message || err.message || '删除数据失败';
        ElMessage.error(errorMsg);
      }
    } finally {
      loading.value = false;
    }
  };

  // 批量修改按钮点击事件
  const handleBatchEdit = () => {
    if (selectedRows.value.length !== 1) {
      ElMessage.warning('请选择一条记录进行修改');
      return;
    }

    isBatchEdit.value = false;
    editRowOriginal.value = { ...selectedRows.value[0] };
    editForm.value = { ...selectedRows.value[0] };
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

  // 格式化单元格显示（解决科学计数法和时间格式问题）
  const formatCell = (value: string | number | null | undefined, column?: TableColumn): string => {
    if (value === null || value === undefined) return '';

    // 检查是否为时间字段
    if (column?.data_type) {
      const dataType = typeof column.data_type === 'string' ? column.data_type : String(column.data_type);
      // 如果是时间类型字段
      if (dataType.includes('timestamp') || dataType.includes('date') || dataType.includes('time')) {
        return formatDateTime(value);
      }
    }

    // 尝试转换为数字
    const numValue = Number(value);

    // 如果是有效数字
    if (!isNaN(numValue)) {
      // 对于极小的数字（如 E-51），直接返回原始字符串，避免显示为 0.000000
      if (Math.abs(numValue) < 0.0001) {
        // 如果是科学计数法表示的极小值，保持原样
        if (typeof value === 'string' && value.includes('E')) {
          return value;
        }
        // 否则显示为 0
        return '0';
      }

      // 对于正常的数字，保留6位小数
      if (Math.abs(numValue) <= 999999) {
        return numValue.toFixed(6);
      }

      // 对于大数字，保持原样
      return String(value);
    }

    return String(value);
  };

  // 格式化日期时间（ISO 8601 → 年-月-日 时:分:秒）
  const formatDateTime = (value: string | number): string => {
    if (!value) return '';

    try {
      // 创建Date对象
      const date = new Date(value);

      // 检查是否为有效日期
      if (isNaN(date.getTime())) {
        return String(value);
      }

      // 格式化：YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('日期格式化失败:', error);
      return String(value);
    }
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
    margin: 0;
    color: #333;
    font-size: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .title-with-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .record-count {
    color: #666;
    font-size: 14px;
    white-space: nowrap;
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
