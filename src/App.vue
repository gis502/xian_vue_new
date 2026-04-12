<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElLoading } from 'element-plus'
import { watch } from 'vue';
import { useViewerStore } from './stores/useViewerStore';


const loadingOption = {
  fullscreen: true,
  text: '正在加载配置相关资源中...'
}

let loadingInstanve = ElLoading.service(loadingOption)

watch(() => useViewerStore().getViewerLoadingCompleted(), (val) => {
  if (val) {
    loadingInstanve.close()
  } else {
    loadingInstanve = ElLoading.service(loadingOption)
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
