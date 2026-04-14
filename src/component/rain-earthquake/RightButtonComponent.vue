<template>
  <div class="right-button-box">
    <ul class="right-button-ul">
      <li v-for="(buttonItem, index) in buttonList" :key="index">
        <button
          @click="handelButton(index, buttonItem.callback)"
          :style="{
            'background-image': `url(${selectedButtonId == index ? rightOrangeButton : rightBlueButton})`,
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
  import { ref, type Ref } from 'vue';

  // 记录选中按钮id
  const selectedButtonId: Ref<number> = ref(-1);

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
    if (index == selectedButtonId.value) {
      selectedButtonId.value = -1;
      return;
    } else if (
      selectedButtonId.value != -1 &&
      selectedButtonId.value != index
    ) {
      return;
    }
    selectedButtonId.value = index;
    callback();
    if (props.buttonList[index].executeOnce) {
      selectedButtonId.value = -1;
    }
  };
</script>

<style scoped>
  .right-button-box {
    width: 180px;
    position: absolute;
    top: 45px;
    right: 200px;
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
