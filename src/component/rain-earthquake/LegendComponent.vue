<!-- 图例组件 -->
<template>
  <!-- 控制按钮 -->
  <div
    class="control-box"
    :style="{
      bottom: `${useStatusStore().uiComponents.legendShow ? 248 : 25}px`,
    }"
  >
    <el-button
      @click="changeStatus"
      circle
      :title="`${useStatusStore().uiComponents.legendShow ? '关闭' : '打开'}图例`"
      >{{ useStatusStore().uiComponents.legendShow ? '-' : '+' }}</el-button
    >
  </div>
  <div class="legend-box" v-show="useStatusStore().uiComponents.legendShow">
    <div class="title-box">
      <header>图例</header>
    </div>
    <div class="legend-list-box">
      <el-row
        v-for="(list, index1) in finalLegendList"
        :key="index1"
        class="legend-row"
      >
        <el-col
          :span="24 / colsNum"
          v-for="(item, index2) in list"
          :key="`${index1}_${index2}`"
        >
          <div class="legend-item">
            <img :src="item.link" :alt="item.name" class="legend-item-img" />
            <span class="legend-item-text">{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStatusStore } from '@/stores/useStatusStore';
  import { Utils } from '@/utils/utils';
  import { onMounted, ref, type Ref } from 'vue';

  // 接收父组件传递的属性
  const props = defineProps<{
    legendList: { name: string; link: string }[];
    colsNum: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;
  }>();

  // 处理后图例列表
  const finalLegendList: Ref<{ name: string; link: string }[][]> = ref([]);

  // 切换图例显示状态
  const changeStatus = () => {
    useStatusStore().uiComponents.legendShow =
      !useStatusStore().uiComponents.legendShow;
  };

  onMounted(() => {
    finalLegendList.value = Utils.chunkArray(props.legendList, props.colsNum);
  });
</script>

<style scoped>
  .legend-box {
    position: absolute;
    bottom: 20px;
    right: 15px;
    z-index: 1000;
    width: 310px;
    height: 265px;
    overflow-y: auto;
    box-shadow: inset 0px 0px 9px rgba(62, 136, 210, 1);
    color: white;
    font-family: Arial, sans-serif;
    border: 1px solid rgba(0, 225, 255, 1);
  }

  .control-box {
    position: absolute;
    right: 30px;
    z-index: 1001;
  }

  .title-box {
    background: linear-gradient(
      180deg,
      rgba(86, 204, 242, 1) 0%,
      rgba(47, 128, 237, 1) 100%
    );
    height: 25px;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .legend-list-box {
    background: rgba(14, 52, 98, 0.8);
    padding: 10px;
    height: calc(100% - 45px);
    box-sizing: border-box;
  }

  .legend-row {
    margin-bottom: 2px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    margin: 0;
    min-height: 20px;
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  .legend-item-img {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    object-fit: contain;
    margin-right: 8px;
  }

  .legend-item-text {
    flex: 1;
    text-align: justify;
    text-justify: inter-ideograph;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.5px;
    word-break: break-all;
  }
</style>
