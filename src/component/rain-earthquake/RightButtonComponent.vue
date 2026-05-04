<template>
  <div
    class="right-button-box"
    v-show="useStatusStore().uiComponents.rightButton.show"
  >
    <ul class="right-button-ul">
      <li v-for="(buttonItem, index) in buttonList" :key="index">
        <button
          @click="handelButton(index, buttonItem.callback)"
          :style="{
            'background-image': `url(${useButtonSelectedIdStore().rightButtonSelectedId == index ? rightOrangeButton : rightBlueButton})`,
          }"
        >
          {{ buttonItem.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { rightBlueButton, rightOrangeButton } from '@/assets';
  import { useButtonSelectedIdStore } from '@/stores/useButtonSelectedIdStore.ts';
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import { onMounted } from 'vue';

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
      useButtonSelectedIdStore().rightButtonSelectedId = lastSelectedIndex;
      props.buttonList[lastSelectedIndex].callback();
    }
  });

  // 点击按钮触发
  const handelButton = (
    index: number,
    callback: (...args: unknown[]) => unknown
  ) => {
    if (index == useButtonSelectedIdStore().rightButtonSelectedId) {
      useButtonSelectedIdStore().rightButtonSelectedId = -1;
      callback(false);
      return;
    } else if (
      useButtonSelectedIdStore().rightButtonSelectedId != -1 &&
      useButtonSelectedIdStore().rightButtonSelectedId != index
    ) {
      return;
    }
    useButtonSelectedIdStore().rightButtonSelectedId = index;
    callback(true);
    if (props.buttonList[index].executeOnce) {
      useButtonSelectedIdStore().rightButtonSelectedId = -1;
    }
  };
</script>

<style scoped>
  .right-button-box {
    width: 180px;
    position: absolute;
    top: 45px;
    right: 40px;
    z-index: 1000;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0);
    padding: 15px 0;
  }

  .right-button-ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .right-button-ul li {
    margin: 15px 0 0 0;
    padding: 0;
    text-align: center;
  }
  .right-button-ul li button {
    width: 190px;
    height: 30px;
    padding: 5px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    white-space: nowrap;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    background-color: transparent;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 20px center;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
</style>
