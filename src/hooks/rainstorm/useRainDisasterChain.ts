import { ref, watch } from 'vue';
import type { XianHiddenDangerSpots } from '@/types/base/XianHiddenDangerSpots';
import { HiddenPointType } from '@/types/common/DisasterType';
import type { PaginationType } from '@/types/common/PaginationType';

// 灾害链影响点列表钩子函数
export const useRainDisasterChain = () => {
  // 搜索条件
  const conditions = ref({
    tableData: '',
    hiddenPoint: HiddenPointType.LANDSLIDE,
  });

  // 下拉选项
  const selectOptions = [
    { value: HiddenPointType.LANDSLIDE, label: '滑坡' },
    { value: HiddenPointType.DEBRIS_FLOW, label: '泥石流' },
    { value: HiddenPointType.FLASH_FLOOD, label: '山洪' },
    { value: HiddenPointType.WATERLOGGING, label: '内涝' },
  ];

  // 表格数据
  const tableDatas = ref<XianHiddenDangerSpots[]>([]);

  // 表头
  const tableColumns = [
    { title: '名称', key: 'disasterName' },
    { title: '位置', key: 'position' },
    { title: '规模等级', key: 'scaleGrade' },
    { title: '险情等级', key: 'riskGrade' },
  ];

  // 分页配置
  const paginationConfig = ref<PaginationType>({
    currentPage: 1,
    pageSize: 10,
    total: 10,
    totalPage: 1,
  });

  // 修改条件
  function changeConditions(value: {
    tableData: string;
    hiddenPoint: HiddenPointType;
  }): void {
    conditions.value = value;
  }

  // 修改页码
  function changeCurrentPage(value: number) {
    paginationConfig.value.currentPage = value;
  }

  // 监听条件变化
  watch(
    conditions,
    () => {
      console.log('条件改变');
    },
    { deep: true }
  );

  // 把所有需要用到的数据/方法 return 出去
  return {
    conditions,
    selectOptions,
    tableDatas,
    tableColumns,
    paginationConfig,
    changeConditions,
    changeCurrentPage,
  };
};
