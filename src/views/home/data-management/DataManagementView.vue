<template>
  <div class="data-management-view">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 搜索组件 -->
      <SearchComponent @search="handleSearch" @clear="handleClear" />

      <!-- 按钮组件 -->
      <ButtonComponent
        :selected-rows="selectedRows"
        @delete-selected="handleDeleteSelected"
        @modify-selected="handleModifySelected"
      />
    </div>

    <!-- 表信息组件（内部包含可滚动的表格） -->
    <TableInformationComponent
      ref="tableInfoRef"
      :search-keyword="searchKeyword"
      @loaded="onDataLoaded"
      @view-detail="handleViewDetail"
      @selection-change="handleSelectionChange"
    />

    <!-- 表格详情组件 -->
    <TableDetailComponent ref="tableDetailRef" />
  </div>
</template>

<script lang="ts" setup>
  import SearchComponent from '@/component/data-management/SearchComponent.vue';
  import ButtonComponent from '@/component/data-management/ButtonComponent.vue';
  import TableDetailComponent from '@/component/data-management/TableDetailComponent.vue';
  import TableInformationComponent from '@/component/data-management/TableInformationComponent.vue';
  import { onMounted, ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import type { TableInfo } from '@/api/data-management';
  import { useStatusStore } from '@/stores/useStatusStore';

  // 初始化状态store
  const statusStore = useStatusStore();

  // 表详情组件引用
  const tableDetailRef = ref();
  const tableInfoRef = ref();

  // 搜索关键字
  const searchKeyword = ref('');

  // 选中的行
  const selectedRows = ref<TableInfo[]>([]);

  // 处理搜索
  const handleSearch = (keyword: string) => {
    searchKeyword.value = keyword;
  };

  // 处理清空
  const handleClear = () => {
    searchKeyword.value = '';
    selectedRows.value = [];
    tableInfoRef.value?.clearSelection();
  };

  // 处理选中变化
  const handleSelectionChange = (rows: TableInfo[]) => {
    selectedRows.value = rows;
  };

  // 处理删除选中
  const handleDeleteSelected = async () => {
    if (!selectedRows.value || selectedRows.value.length === 0) {
      ElMessage.warning('请至少选中一条数据');
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 条数据吗？删除后可通过还原按钮恢复。`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );

      tableInfoRef.value?.deleteTables(selectedRows.value);
      selectedRows.value = [];
      tableInfoRef.value?.clearSelection();
      ElMessage.success('删除成功');
    } catch {
      // 用户取消操作
    }
  };

  // 处理修改选中
  const handleModifySelected = () => {
    if (!selectedRows.value || selectedRows.value.length !== 1) {
      if (!selectedRows.value || selectedRows.value.length === 0) {
        ElMessage.warning('请选中一条数据');
      } else {
        ElMessage.warning('只能选中一条数据进行修改');
      }
      return;
    }
    tableInfoRef.value?.handleModifySelected();
  };

  // 数据加载完成回调
  const onDataLoaded = () => {
    statusStore.appLoadingCompleted = true;
  };

  // 处理查看表详情
  const handleViewDetail = (tableName: string, rowCount?: number) => {
    tableDetailRef.value?.showDialog(tableName, rowCount);
  };

  // 组件挂载时的处理
  onMounted(() => {
    // 设置应用正在加载
    statusStore.appLoadingCompleted = false;
    console.log('数据管理模块已加载');
  });
</script>

<style scoped>
  .data-management-view {
    background-color: rgba(15, 61, 118, 0.8);
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .fixed-header {
    flex-shrink: 0;
    background-color: rgba(15, 61, 118, 0.8);
  }
</style>
