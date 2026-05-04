<template>
  <div
    class="control-show-panel-box"
    v-show="useStatusStore().uiComponents.controlPanel.show"
  >
    <div class="title-box">
      <header>图例与控制</header>
    </div>

    <div class="control-show-list">
      <!-- 按分类显示 -->
      <div
        v-for="(category, categoryIndex) in categorizedList"
        :key="categoryIndex"
        class="category-section"
      >
        <!-- 分类标题 -->
        <div class="category-title">{{ category.title }}</div>
        <!-- 分类下的项目 -->
        <div
          v-for="(item, index) in category.items"
          :key="index"
          class="control-item"
        >
          <el-checkbox
            v-model="item.statusStore[item.statusKey].show"
            @change="
              changeStatus(item.statusStore[item.statusKey].show, item.callback)
            "
          />
          <!-- 图例部分 -->
          <div class="legend-content">
            <!-- 支持图片链接 -->
            <img
              v-if="item.link"
              :src="item.link"
              :alt="item.name"
              class="legend-item-img"
            />
            <!-- 支持HTML+CSS样式 -->
            <div
              v-else-if="item.html"
              v-html="item.html"
              class="legend-item-html"
            ></div>
          </div>
          <!-- 描述文字 -->
          <span class="item-description">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation.ts';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { computed } from 'vue';

  const props = defineProps<{
    constrolShowList: {
      name: string;
      statusStore: Record<string, { show: boolean; loading: boolean }>;
      statusKey: string;
      callback: (...args: unknown[]) => unknown;
      link?: string; // 图例图片链接
      html?: string; // 图例HTML内容
      category?: string; // 分类名称
    }[];
  }>();

  // 按分类组织的数据
  const categorizedList = computed(() => {
    const categories: Record<
      string,
      { title: string; items: typeof props.constrolShowList }
    > = {};

    props.constrolShowList.forEach((item) => {
      const categoryName = item.category || '其他';
      if (!categories[categoryName]) {
        categories[categoryName] = {
          title: categoryName,
          items: [],
        };
      }
      categories[categoryName].items.push(item);
    });

    return Object.values(categories);
  });

  // 状态改变执行
  const changeStatus = (
    status: boolean,
    callback: (...args: unknown[]) => unknown
  ) => {
    // 重置信息框状态，隐藏显示
    useLoadingInformationStore().resetStatue();

    // 调用回调函数
    callback(status);
  };
</script>

<style scoped>
  .control-show-panel-box {
    position: absolute;
    bottom: 20px;
    right: 20px;
    border-radius: 2px;
    z-index: 1000;
    width: 200px;
    overflow: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    border: 1px solid rgb(0, 225, 255);
    max-height: 650px;
  }
  .title-box {
    font-weight: bold;
    font-size: 16px;
    background: linear-gradient(
      180deg,
      rgb(86, 204, 242) 0%,
      rgb(47, 128, 237) 100%
    );
    padding: 8px;
    text-align: center;
  }
  .control-show-list {
    background: rgba(14, 52, 98, 0.8);
    padding: 8px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 6px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .category-section {
    margin-bottom: 8px;
  }
  .category-title {
    font-weight: bold;
    font-size: 14px;
    color: #00e1ff;
    padding: 4px 0;
    margin-bottom: 4px;
    border-bottom: 1px solid rgba(0, 225, 255, 0.3);
  }
  .control-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 0;
  }
  .legend-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
  }
  .legend-item-img {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    object-fit: contain;
  }
  .legend-item-html {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .legend-item-html :deep(*) {
    width: 100%;
    height: 100%;
  }
  .item-description {
    flex: 1;
    text-align: justify;
    text-justify: inter-ideograph;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.5px;
    word-break: break-all;
  }
  :deep(.el-checkbox) {
    height: auto;
    color: #fff;
    margin-right: 0;
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #fff;
  }
</style>
