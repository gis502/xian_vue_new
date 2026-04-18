<template>
  <div class="control-show-panel-box">
    <div class="title-box">
      <header>控制显示</header>
    </div>

    <div class="control-show-list">
      <div v-for="(item, index) in constrolShowList" :key="index">
        <el-checkbox
          v-model="item.statusStore[item.statusKey].show"
          :label="item.name"
          @change="
            changeStatus(item.statusStore[item.statusKey].show, item.callback)
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation';

  defineProps<{
    constrolShowList: {
      name: string;
      statusStore: Record<string, { show: boolean; loading: boolean }>;
      statusKey: string;
      callback: (...args: unknown[]) => unknown;
    }[];
  }>();

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
    top: 75px;
    right: 0px;
    border-radius: 2px;
    z-index: 1000;
    width: 160px;
    overflow: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    border: 1px solid rgb(0, 225, 255);
  }
  .title-box {
    font-weight: bold;
    font-size: 12px;
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
    font-size: 12px;
    gap: 6px;
  }
  :deep(.el-checkbox) {
    height: auto;
    color: #fff;
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #fff;
  }
</style>
