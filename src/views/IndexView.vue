<!-- 入口 -->
<template>
  <div class="nav-container">
    <div
      class="top-nav"
      :style="{ 'background-image': `url(${backgroundImage})` }"
    >
      <div class="logo-img">
        <img :src="mainLogoImage" alt="西安应急智慧logo" id="main_logo" />
      </div>
      <div class="nav-list">
        <router-link
          @click="useStatusStore().setAppLoadingCompleted(false)"
          v-for="(item, index) in topNavMap"
          :key="index"
          :to="{ name: item.name, query: item.query }"
          class="nav-item"
          :class="{ active: isActive(item.query.identification) }"
        >
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
  <div class="content-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
  import { useStatusStore } from '@/stores/useStatusStore';
  import { RouterView } from 'vue-router';
  import { backgroundImage, mainLogoImage } from '@/assets';
  import { useIndex } from '@/hooks/useIndex';

  // 获取钩子函数
  const { topNavMap, isActive } = useIndex();
</script>

<style scoped>
  .nav-container {
    height: 50px;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    z-index: 10000000;
  }

  .top-nav {
    width: 100%;
    height: 50px;
    background-size: cover;
    background-position: center;
    padding: 0 40px;
    box-sizing: border-box;
    display: flex;
  }

  .nav-list {
    margin-left: 100px;
    display: flex;
    align-items: center;
  }

  .nav-item {
    color: white;
    text-decoration: none;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    transition: background-color 0.3s;
  }

  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .content-container {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
  }

  #main_logo {
    height: 50px;
    margin-right: 100px;
  }

  .nav-item.active {
    background-color: rgba(255, 255, 255, 0.3);
    border-bottom: 3px solid #409eff;
    font-weight: bold;
    box-sizing: border-box;
  }
</style>
