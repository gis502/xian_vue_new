<template>
  <div
    v-show="statusStore.uiComponents.leftButton.show"
    class="left-button-box"
    :style="{
      left: `${statusStore.uiComponents.disasterChainPointShow.show ? 575 : 100}px`,
    }"
  >
    <ul class="left-button-ul">
      <li v-for="(buttonItem, index) in buttonList" :key="index">
        <button
          @click="handelButton(index, buttonItem.callback)"
          :style="{
            'background-image': `url(${buttonSelectedIdStore.leftButtonSelectedId == index ? leftOrangeButton : leftBlueButton})`,
          }"
        >
          {{ buttonItem.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { leftBlueButton, leftOrangeButton } from '@/assets';
  import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore.ts';
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import { onMounted } from 'vue';

  const statusStore = useStatusStore();
  const buttonSelectedIdStore = useButtonSelectedIdStore();

  // 接收父组件传递的参数
  const props = defineProps<{
    buttonList: {
      name: string;
      callback: (...args: unknown[]) => unknown;
      executeOnce?: boolean;
      selected?: boolean;
    }[];
  }>();

  // 组件挂载时初始化选中状态
  onMounted(() => {
    // 查找最后一个设置了 selected: true 的按钮
    let lastSelectedIndex = -1;
    for (let i = 0; i < props.buttonList.length; i++) {
      if (props.buttonList[i].selected === true) {
        lastSelectedIndex = i;
      }
    }

    // 如果找到了选中的按钮，设置选中状态，同时执行回调函数
    if (lastSelectedIndex !== -1) {
      buttonSelectedIdStore.leftButtonSelectedId = lastSelectedIndex;
      props.buttonList[lastSelectedIndex].callback();
    }
  });

  // 点击按钮触发
  const handelButton = (
    index: number,
    callback: (...args: unknown[]) => unknown
  ) => {
    // 取消选中
    if (index == buttonSelectedIdStore.leftButtonSelectedId) {
      callback(false);
      buttonSelectedIdStore.leftButtonSelectedId = -1;
      return;
    } else if (
      buttonSelectedIdStore.leftButtonSelectedId != -1 &&
      buttonSelectedIdStore.leftButtonSelectedId != index
    ) {
      console.error('当前按钮选中有误，请选择正确的按钮。');
      return;
    }
    buttonSelectedIdStore.leftButtonSelectedId = index;
    callback(true);

    // 如果该按钮只执行一次，则取消选中
    if (props.buttonList[index].executeOnce) {
      buttonSelectedIdStore.leftButtonSelectedId = -1;
    }
  };
</script>

<style scoped>
  .left-button-box {
    width: 180px;
    position: absolute;
    top: 95px;
    z-index: 1000;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0);
    padding: 15px 0;
  }

  .left-button-ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .left-button-ul li {
    margin: 15px 0 0 0;
    padding: 0;
    text-align: center;
  }
  .left-button-ul li button {
    width: 250px;
    height: 30px;
    padding: 5px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    white-space: nowrap;
    min-width: 100px;
    display: flex;
    align-items: center;
    opacity: 1;
    background-color: transparent;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: -30px center;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
</style>
