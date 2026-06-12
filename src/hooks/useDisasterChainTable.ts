import { ref } from 'vue';
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
import type { PaginationType } from '@/types/common/PaginationType';
import { PointType } from '@/types/common/DisasterType';

/**
 * 灾害链表格数据选项
 */
export interface SelectOption {
  value: PointType;
  label: string;
}

/**
 * 表格列配置
 */
export interface TableColumn {
  title: string;
  key: string;
}

/**
 * 搜索条件
 */
export interface SearchConditions {
  tableData: string;
  hiddenPoint: PointType;
}

/**
 * 灾害链表格
 * 负责管理灾害链影响点列表的数据获取、搜索和分页
 * @returns 表格相关的状态和方法
 */
export const useDisasterChainTable = () => {
  // ==================== 状态 ====================

  /**
   * 下拉选项配置
   */
  const selectOptions = ref<SelectOption[]>([]);

  /**
   * 表格列配置
   */
  const tableColumns = ref<TableColumn[]>([]);

  /**
   * 搜索条件
   */
  const conditions = ref<SearchConditions>({
    tableData: '',
    hiddenPoint: PointType.LANDSLIDE,
  });

  /**
   * 表格数据
   */
  const tableDatas = ref<XianHiddenDangerSpots[]>([]);

  /**
   * 分页配置
   */
  const paginationConfig = ref<PaginationType>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPage: 0,
  });

  /**
   * 加载状态
   */
  const loading = ref(false);

  /**
   * 修改搜索条件
   * @param value - 新的搜索条件
   */
  const changeConditions = ref((value: SearchConditions): void => {
    conditions.value = value;
  });

  /**
   * 修改页码
   * @param value - 新的页码
   */
  const changeCurrentPage = (value: number) => {
    paginationConfig.value.currentPage = value;
  };

  /**
   * 设置条件
   * @param newConditions 新的条件
   */
  const setConditions = (newConditions: SearchConditions) => {
    conditions.value = newConditions;
  };

  /**
   * 获取条件
   * @returns
   */
  const getConditions = () => conditions.value;

  /**
   * 设置下拉选项
   * @param options - 下拉选项数组
   */
  const setSelectOptions = (options: SelectOption[]) => {
    selectOptions.value = options;
  };

  /**
   * 设置表格列配置
   * @param columns - 表格列配置数组
   */
  const setTableColumns = (columns: TableColumn[]) => {
    tableColumns.value = columns;
  };

  // ==================== 返回 ====================

  return {
    // 状态
    selectOptions,
    tableColumns,
    conditions,
    tableDatas,
    paginationConfig,
    loading,
    changeConditions,
    setConditions,
    getConditions,
    changeCurrentPage,
    setSelectOptions,
    setTableColumns,
  };
};
