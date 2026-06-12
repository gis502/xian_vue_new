import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
import { PointType } from '@/types/common/DisasterType';
import type { PaginationType } from '@/types/common/PaginationType';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 灾害链影响点列表
 */
export const useDisasterChainTableStore = defineStore(
  'disasterChainTable',
  () => {
    // ================灾害链影响点列表================================
    /**
     * 搜索条件
     */
    const conditions = ref({
      tableData: '',
      hiddenPoint: PointType.LANDSLIDE,
    });
    /**
     * 下拉选项
     */
    const selectOptions = ref();

    /**
     * 表格数据
     */
    const tableDatas = ref<XianHiddenDangerSpots[]>([]);

    /**
     * 表头配置
     */
    const tableColumns = ref();

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
     * 修改搜索条件
     * @param value - 新的搜索条件
     */
    const changeConditions = (value: {
      tableData: string;
      hiddenPoint: PointType;
    }): void => {
      conditions.value = value;
    };

    /**
     * 修改页码
     * @param value - 新的页码
     */
    const changeCurrentPage = (value: number) => {
      paginationConfig.value.currentPage = value;
    };

    return {
      conditions,
      selectOptions,
      tableDatas,
      tableColumns,
      paginationConfig,
      changeConditions,
      changeCurrentPage,
    };
  }
);
