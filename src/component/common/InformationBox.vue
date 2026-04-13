<!-- 内容显示组件 -->
<template>
  <div
    class="infomation-box"
    :style="{
      width: `${width}px`,
      'max-height': `${height}px`,
      top: `${newOffsetY}px`,
      left: `${newOffsetX}px`,
    }"
  >
    <header>
      <div class="title">
        <h3>{{ title }}</h3>
      </div>
    </header>
    <div class="content">
      <table class="table">
        <tr v-for="(tableData, index) in tableDatas" :key="index">
          <td class="label">{{ tableData.title }}</td>
          <td>{{ tableData.content }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Utils } from '@/utils/utils';
  import { onMounted, ref, type Ref } from 'vue';

  const props = defineProps<{
    title: string;
    data: Record<string, string>;
    field: Record<string, string>;
    offsetX: number;
    offsetY: number;
  }>();

  // 定义宽高和偏移
  const width = ref(400);
  const height = ref(450);
  const newOffsetX = ref(props.offsetX);
  const newOffsetY = ref(props.offsetY);

  const tableDatas: Ref<{ title: string; content: string }[]> = ref([]);

  onMounted(() => {
    // 判断是否超出屏幕，超出就重新定位
    [newOffsetX.value, newOffsetY.value] = Utils.keepWithinScreen(
      props.offsetX,
      props.offsetY,
      width.value,
      height.value
    );

    // 数据转换
    Object.entries(props.data).forEach(([key, value]) => {
      // 判读key是不是存在field中，存在就添加到表格数据，不存在则不添加
      if (Object.hasOwn(props.field, key) && value) {
        tableDatas.value.push({
          title: props.field[key],
          content: value,
        });
      }
    });
  });
</script>

<style scoped>
  .infomation-box {
    overflow-y: auto;
    position: absolute;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: rgba(14, 52, 98, 0.95);
    padding: 2px 15px;
    border-bottom: 1px solid #e9ecef;
    box-sizing: border-box;
    height: 40px;
  }

  .title h3 {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Source Han Sans CN';
  }

  .content {
    width: 100%;
    color: #fff;
    background-color: rgba(0, 94, 153, 1);
  }

  .table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
  }

  .table tr td {
    padding: 8px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    border-left: none;
    border-right: none;
    text-align: left;
    font-family: 'Source Han Sans CN';
    font-size: 13px;
  }

  .label {
    width: 30%;
    font-size: 13px;
  }
</style>
