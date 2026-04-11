<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElLoading } from 'element-plus'
import { watch } from 'vue';
import { useViewerStore } from './stores/useViewerStore';
const loadingInstanve = ElLoading.service({
  fullscreen: true,
  text: '正在加载配置相关资源中...'
})

watch(() => useViewerStore().getViewerLoadingCompleted(), (val) => {
  if (val == true) {
    loadingInstanve.close()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: '微软雅黑';
}
</style>
