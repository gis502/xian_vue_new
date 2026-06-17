<template>
  <div
      v-if="showPulsePointList"
      ref="listRef"
      class="pulse-point-list"
      :style="{ right: position.right + 'px', bottom: position.bottom + 'px' }"
  >
    <div class="list-header" @mousedown="startDrag">
      <span>脉冲点列表 ({{ pulsePoints.length }})</span>
      <el-button
          type="primary"
          size="small"
          @click="exportToWord"
          class="export-btn"
          :icon="Download"
      >
        导出
      </el-button>
    </div>

    <div class="search-box">
      <el-input
          v-model="searchKeyword"
          placeholder="搜索点位..."
          clearable
          size="small"
          prefix-icon="Search"
      />
    </div>

    <div class="point-list-content">
      <el-table
          :data="filteredPoints"
          border
          stripe
          max-height="300"
          style="width: 100%"
          empty-text="暂无数据"
      >
        <!-- 名称列 - 悬浮时文字换行展开 -->
        <el-table-column
            prop="value"
            label="名称"
            width="150"
        >
          <template #default="{ row }">
            <span class="name-cell">
              {{ (row as any).value || '未命名' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getCategoryType(row.category)">
              {{ getCategoryName((row as any).category) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="坐标" width="135" align="center">
          <template #default="{ row }">
            <div class="coordinate">
              {{ (row as any).lon?.toFixed(4) || '-' }}, {{ (row as any).lat?.toFixed(4) || '-' }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, reactive, watch, nextTick } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { AnalysisButtonState } from '@/types/common/useAroundAnalysisType';

const analysisButtonState = inject<AnalysisButtonState>('analysisButtonState');

const pulsePoints = computed(() => analysisButtonState?.pulsePoints.value || []);
const showPulsePointList = computed(() => analysisButtonState?.showPulsePointList.value || false);

const searchKeyword = ref('');
const listRef = ref<HTMLElement | null>(null);

// 使用 right 和 bottom 定位（距离右下角的偏移量）
const position = reactive({ right: 20, bottom: 20 });
const isDragging = ref(false);
const dragStart = reactive({ x: 0, y: 0 });
const initialPosition = reactive({ right: 0, bottom: 0 });
const listSize = reactive({ width: 375, height: 420 });

// 获取列表的实际尺寸
const updateListSize = () => {
  if (listRef.value) {
    const rect = listRef.value.getBoundingClientRect();
    listSize.width = rect.width;
    listSize.height = rect.height;
  }
};

// 边界限制函数
const constrainPosition = (right: number, bottom: number) => {
  updateListSize();

  const actualLeft = window.innerWidth - listSize.width - right;
  const actualTop = window.innerHeight - listSize.height - bottom;

  let constrainedRight = right;
  let constrainedBottom = bottom;

  if (actualLeft < 0) {
    constrainedRight = window.innerWidth - listSize.width;
  }
  if (actualLeft > window.innerWidth - listSize.width) {
    constrainedRight = 0;
  }
  if (actualTop < 100) {
    constrainedBottom = window.innerHeight - listSize.height - 100;
  }
  if (actualTop > window.innerHeight - listSize.height) {
    constrainedBottom = 0;
  }

  constrainedRight = Math.max(0, Math.min(constrainedRight, window.innerWidth - listSize.width));
  constrainedBottom = Math.max(0, Math.min(constrainedBottom, window.innerHeight - listSize.height));

  return {
    right: constrainedRight,
    bottom: constrainedBottom
  };
};

// 重置位置到右下角
const resetPosition = () => {
  nextTick(() => {
    updateListSize();
    position.right = 20;
    position.bottom = 20;
  });
};

// 监听列表显示状态
watch(showPulsePointList, async (newValue) => {
  if (newValue) {
    await nextTick();
    resetPosition();
  }
});

// 监听窗口大小变化
watch(() => window.innerWidth, () => {
  if (showPulsePointList.value) {
    resetPosition();
  }
});

watch(() => window.innerHeight, () => {
  if (showPulsePointList.value) {
    resetPosition();
  }
});

const filteredPoints = computed(() => {
  if (!searchKeyword.value) return pulsePoints.value;

  const keyword = searchKeyword.value.toLowerCase();
  return pulsePoints.value.filter(point =>
      point.value?.toLowerCase().includes(keyword) ||
      point.category?.toLowerCase().includes(keyword)
  );
});
// 导出为 Word 文档
const exportToWord = async () => {
  try {
    const points = filteredPoints.value;

    // 统计各类别数量
    const categoryCount: Record<string, number> = {};
    points.forEach(point => {
      const category = getCategoryName(point.category);
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // 创建表格行数据
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '序号', alignment: AlignmentType.CENTER })],
            width: { size: 8, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '名称', alignment: AlignmentType.CENTER })],
            width: { size: 35, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '类型', alignment: AlignmentType.CENTER })],
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '坐标', alignment: AlignmentType.CENTER })],
            width: { size: 42, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ];

    // 添加数据行
    points.forEach((point, index) => {
      tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: String(index + 1), alignment: AlignmentType.CENTER })],
              }),
              new TableCell({
                children: [new Paragraph({ text: point.value || '未命名' })],
              }),
              new TableCell({
                children: [new Paragraph({ text: getCategoryName(point.category), alignment: AlignmentType.CENTER })],
              }),
              new TableCell({
                children: [new Paragraph({
                  text: `${point.lon?.toFixed(4) || '-'}, ${point.lat?.toFixed(4) || '-'}`,
                  alignment: AlignmentType.CENTER
                })],
              }),
            ],
          })
      );
    });

    // 创建统计数据段落
    const statsParagraphs = Object.entries(categoryCount).map(([category, count]) => {
      return new Paragraph({
        children: [
          new TextRun({ text: `${category}: `, bold: true }),
          new TextRun({ text: `${count} 个` }),
        ],
      });
    });

    // 创建文档
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // 标题
            new Paragraph({
              text: '脉冲点列表导出报告',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),

            // 空行
            new Paragraph({}),

            // 总数统计
            new Paragraph({
              children: [
                new TextRun({ text: '总点数: ', bold: true }),
                new TextRun({ text: `${points.length} 个` }),
              ],
            }),

            // 空行
            new Paragraph({}),

            // 分类统计标题
            new Paragraph({
              text: '分类统计:',
              heading: HeadingLevel.HEADING_2,
            }),

            // 分类统计数据
            ...statsParagraphs,

            // 空行
            new Paragraph({}),

            // 详细数据标题
            new Paragraph({
              text: '详细数据:',
              heading: HeadingLevel.HEADING_2,
            }),

            // 空行
            new Paragraph({}),

            // 表格
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    // 生成并下载文档
    const blob = await Packer.toBlob(doc);
    const fileName = `脉冲点列表_${new Date().toISOString().slice(0, 10)}.docx`;
    saveAs(blob, fileName);

  } catch (error) {
    console.error('导出失败:', error);
    alert('导出失败，请重试');
  }
};
// 开始拖动
const startDrag = (e: MouseEvent) => {
  // Deleted:if ((e.target as HTMLElement).closest('.close-btn')) return;

  isDragging.value = true;
  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
  initialPosition.right = position.right;
  initialPosition.bottom = position.bottom;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

// 拖动中
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const deltaX = e.clientX - dragStart.x;
  const deltaY = e.clientY - dragStart.y;

  updateListSize();

  const currentLeft = window.innerWidth - listSize.width - position.right;
  const currentTop = window.innerHeight - listSize.height - position.bottom;

  let newLeft = currentLeft + deltaX;
  let newTop = currentTop + deltaY;

  newLeft = Math.max(0, newLeft);
  newLeft = Math.min(newLeft, window.innerWidth - listSize.width);
  newTop = Math.max(100, newTop);
  newTop = Math.min(newTop, window.innerHeight - listSize.height);

  const newRight = window.innerWidth - listSize.width - newLeft;
  const newBottom = window.innerHeight - listSize.height - newTop;

  const constrained = constrainPosition(newRight, newBottom);
  position.right = constrained.right;
  position.bottom = constrained.bottom;

  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
  initialPosition.right = position.right;
  initialPosition.bottom = position.bottom;
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const getCategoryName = (category?: string): string => {
  const nameMap: Record<string, string> = {
    'school': '学校',
    'hospital': '医院',
    'danger': '危险源',
    'shelter': '避难所',
    'fire': '消防站',
    'store': '储备点',
    'subway': '地铁站',
    'hidden-danger': '隐患点',
    'risk-point': '风险点',
    'bridge': '桥梁',
    'reservoir': '水库'
  };
  return nameMap[category || ''] || category || '未知';
};

const getCategoryType = (category?: string): string => {
  const typeMap: Record<string, string> = {
    'school': 'primary',
    'hospital': 'success',
    'danger': 'danger',
    'shelter': 'warning',
    'fire': 'danger',
    'store': 'info',
    'subway': '',
    'hidden-danger': 'warning',
    'risk-point': 'danger',
    'bridge': 'info',
    'reservoir': 'success'
  };
  return typeMap[category || ''] || '';
};
</script>

<style scoped>
.pulse-point-list {
  position: fixed;
  z-index: 100000;
  background: rgba(14, 52, 98, 0.95);
  border: 1px solid rgba(0, 225, 255, 0.5);
  border-radius: 4px;
  padding: 15px;
  width: auto;
  min-width: 350px;
  max-width: 450px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  user-select: none;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 225, 255, 0.3);
  cursor: move;
  flex-shrink: 0;
}

.list-header span {
  color: white;
  font-size: 16px;
  font-weight: bold;
}
.export-btn {
  background-color: rgba(0, 225, 255, 0.3);
  border-color: rgba(0, 225, 255, 0.5);
  color: white;
}

.export-btn:hover {
  background-color: rgba(0, 225, 255, 0.5);
  border-color: rgba(0, 225, 255, 0.8);
}


.search-box {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.point-list-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.coordinate {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  font-family: monospace;
}

/* 表格样式 */
:deep(.el-table) {
  background-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(86, 204, 242, 0.3);
  --el-table-row-hover-bg-color: rgba(0, 225, 255, 0.2);
  --el-table-border-color: rgba(255, 255, 255, 0.2);
  --el-table-text-color: white;
  --el-table-header-text-color: white;
}

:deep(.el-table th.el-table__cell) {
  background: linear-gradient(
      180deg,
      rgb(86, 204, 242) 0%,
      rgb(47, 128, 237) 100%
  );
  color: white;
  font-weight: bold;
  padding: 8px 0 !important;
}

:deep(.el-table td.el-table__cell) {
  background-color: rgba(15, 61, 118, 0.4);
  color: white;
  transition: background-color 0.2s ease;
  padding: 6px 0 !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: rgba(15, 61, 118, 0.6);
}

:deep(.el-table__body tr:hover) > td {
  background-color: rgba(0, 225, 255, 0.15) !important;
}


/* 单元格内容样式 */
:deep(.el-table .cell) {
  padding-left: 8px !important;
  padding-right: 8px !important;
  overflow: visible;
  white-space: normal;
  word-break: break-word;
}

:deep(.el-input__wrapper) {
  background-color: rgba(15, 61, 118, 0.6);
  border: 1px solid rgba(0, 225, 255, 0.3);
  box-shadow: none;
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(0, 225, 255, 0.8) inset;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 225, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 225, 255, 0.5);
}

::-webkit-scrollbar-track {
  background: rgba(15, 61, 118, 0.3);
  border-radius: 3px;
}

/* 隐藏外层容器的滚动条 */
.pulse-point-list::-webkit-scrollbar {
  display: none;
}

/* 表格内部滚动条样式 */
.point-list-content::-webkit-scrollbar {
  width: 6px;
}

.point-list-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.point-list-content::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.point-list-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 名称单元格样式 - 默认截断，悬浮时换行展开 */
.name-cell {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
}

/* 悬浮时展开文字，换行显示完整内容 */
.name-cell:hover {
  white-space: normal;
  word-break: break-word;
}

/* 强制表格头部文字居中 */
:deep(.el-table th.el-table__cell .cell) {
  justify-content: center !important;
  text-align: center !important;
}
</style>
