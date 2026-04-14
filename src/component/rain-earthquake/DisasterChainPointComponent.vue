<!-- 灾害链影响点列表 -->
<template>
  <!-- 控制按钮 -->
  <div class="control-box">
    <el-button
      type="primary"
      @click="changeStatus"
      circle
      :title="`${btnStatus ? '关闭' : '打开'}灾害链影响点列表`"
      >{{ btnStatus ? '-' : '+' }}</el-button
    >
  </div>
  <div class="disaster-list-box" v-show="btnStatus">
    <header class="table-title">
      <span>灾害链影响点列表</span>
    </header>

    <!-- 搜索 -->
    <div class="search-box">
      <el-input
        v-model="conditions.tableData"
        placeholder="搜索表格数据..."
        class="search-data"
      />
      <el-select v-model="conditions.hiddenPoint" class="search-hidden-point">
        <el-option
          v-for="(opt, index) in selectOptions"
          :key="index"
          :label="`${opt.label}预警点`"
          :value="opt.value"
        />
      </el-select>
    </div>
    <!-- 表格 -->
    <div class="table-box">
      <el-table
        :data="tableDataList"
        border
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="(row, index) in tableColumns"
          :key="index"
          :prop="row.key"
          :label="
            index == 0 ? `${conditions.hiddenPoint}${row.title}` : row.title
          "
        />
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-controls" v-if="showPagination">
      <button
        @click="prevPage"
        :disabled="isPrevDisabled"
        :class="{ disabled: pageOption.currentPage <= 1 }"
      >
        上一页
      </button>
      <span>{{ pageOption.currentPage }} / {{ pageOption.totalPage }}</span>
      <button
        @click="nextPage"
        :disabled="isNextDisabled"
        :class="{ disabled: isNextDisabled }"
      >
        下一页
      </button>
      <span class="total-items">共 {{ pageOption.total }} 条</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Point } from '@/types/base/Point';
  import { PointType } from '@/types/common/DisasterType';
  import type { PaginationType } from '@/types/common/PaginationType';
  import { ref, watch, computed, type Ref } from 'vue';

  // 接收父组件的参数
  const props = defineProps<{
    selectOptions: { label: string; value: PointType }[];
    tableDataList: Point[];
    tableColumns: { title: string; key: string }[];
    pageOption: PaginationType;
  }>();

  // 接收父组件方法
  const emits = defineEmits<{
    (
      e: 'changeConditions',
      value: { tableData: string; hiddenPoint: PointType }
    ): void;
    (e: 'changeCurrentPage', value: number): void;
  }>();

  // ==================== 状态管理 ====================

  // 按钮状态
  const btnStatus: Ref<boolean> = ref(false);

  // 搜索条件
  const conditions: Ref<{ tableData: string; hiddenPoint: PointType }> = ref({
    tableData: '',
    hiddenPoint: PointType.LANDSLIDE,
  });

  // ==================== 计算属性 ====================

  // 是否显示分页
  const showPagination = computed(() => props.pageOption.totalPage !== 0);

  // 上一页是否禁用
  const isPrevDisabled = computed(() => props.pageOption.currentPage <= 1);

  // 下一页是否禁用
  const isNextDisabled = computed(
    () => props.pageOption.currentPage >= props.pageOption.totalPage
  );

  // ==================== 事件处理 ====================

  // 切换面板显示状态
  const changeStatus = () => {
    btnStatus.value = !btnStatus.value;
  };

  // 上一页
  const prevPage = () => {
    if (!isPrevDisabled.value) {
      emits('changeCurrentPage', props.pageOption.currentPage - 1);
    }
  };

  // 下一页
  const nextPage = () => {
    if (!isNextDisabled.value) {
      emits('changeCurrentPage', props.pageOption.currentPage + 1);
    }
  };

  // ==================== 监听器 ====================

  // 监听搜索条件变化
  watch(
    conditions,
    () => {
      emits('changeConditions', conditions.value);
    },
    { deep: true }
  );
</script>

<style scoped>
  .control-box {
    position: absolute;
    top: 75px;
    left: 30px;
    z-index: 1001;
  }
  .disaster-list-box {
    position: absolute;
    top: 65px;
    left: 20px;
    background: rgba(14, 52, 98, 0.8);
    color: white;
    padding: 15px;
    border-radius: 2px;
    z-index: 1000;
    width: 550px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    border: 1px solid rgba(0, 225, 255, 0.5);
  }
  .table-title {
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 16px;
    text-align: center;
    margin-top: 0;
    padding-top: 0px;
    color: white;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
  }
  .search-data {
    width: 75%;
  }
  .search-hidden-point {
    width: 25%;
  }
  .search-data,
  .search-hidden-point {
    background: rgba(15, 61, 118, 0.6);
    border-radius: 4px;
    border: 1px solid rgb(0, 225, 255);
    box-sizing: border-box;
    color: white;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background: transparent;
  }
  :deep(.el-input__inner),
  :deep(.el-select__selected-item) {
    color: white;
  }

  :deep(.el-table--border th) {
    background: linear-gradient(
      180deg,
      rgb(86, 204, 242) 0%,
      rgb(47, 128, 237) 100%
    );
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 10px 12px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
  }
  :deep(.el-table tr),
  :deep(.el-table td) {
    background-color: rgba(15, 61, 118, 0.6);
    color: white;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
  }
  .el-table {
    --el-table-row-hover-bg-color: transparent;
  }

  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    gap: 10px;
  }
  .pagination-controls button:disabled {
    background-color: #373e52;
    cursor: not-allowed;
  }
  .pagination-controls span {
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
  .pagination-controls button {
    background-color: #3c86ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
</style>
