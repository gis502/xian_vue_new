<template>
  <div
    class="left-button-box"
    :style="{
      left: `${useStatusStore().uiComponents.disasterChainPointShow.show ? 575 : 100}px`,
    }"
  >
    <ul class="left-button-ul">
      <li v-for="(buttonItem, index) in buttonList" :key="index">
        <button
          @click="handelButton(index, buttonItem.callback)"
          :style="{
            'background-image': `url(${useButtonSelectedIdStore().leftButtonSelectedId == index ? leftOrangeButton : leftBlueButton})`,
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

  // 接收父组件传递的参数
  const props = defineProps<{
    buttonList: {
      name: string;
      callback: (...args: unknown[]) => unknown;
      executeOnce?: boolean;
    }[];
  }>();

  // 点击按钮触发
  const handelButton = (
    index: number,
    callback: (...args: unknown[]) => unknown
  ) => {
    // 取消选中
    if (index == useButtonSelectedIdStore().leftButtonSelectedId) {
      callback(false);
      useButtonSelectedIdStore().leftButtonSelectedId = -1;
      return;
    } else if (
      useButtonSelectedIdStore().leftButtonSelectedId != -1 &&
      useButtonSelectedIdStore().leftButtonSelectedId != index
    ) {
      console.error('当前按钮选中有误，请选择正确的按钮。');
      return;
    }
    useButtonSelectedIdStore().leftButtonSelectedId = index;
    callback(true);

    // 如果该按钮只执行一次，则取消选中
    if (props.buttonList[index].executeOnce) {
      useButtonSelectedIdStore().leftButtonSelectedId = -1;
    }
  };
</script>

<style scoped>
  .left-button-box {
    width: 180px;
    position: absolute;
    top: 45px;
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
