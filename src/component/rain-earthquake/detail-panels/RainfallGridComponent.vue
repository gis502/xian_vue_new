<!-- 降雨栅格图层组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useRainstormDeduction } from '@/hooks/rainstorm/useRainstormDeduction';
  import { useStatusStore } from '@/stores/useStatusStore';
  import type { ApiResponse } from '@/types/ApiResponse';
  import type { RainfallGridResponse } from '@/types/rainstorm/RainfallGridResponse';
  import { WebSocketService } from '@/utils/request/websocket';
  import { onMounted, onUnmounted, watch } from 'vue';

  let rainfallWsService: WebSocketService | null = null;
  const { triggerLayerShowStatus, addGridLayer } = useRainstormDeduction();
  const statusStore = useStatusStore();

  // 请求降雨栅格数据
  const requestRainfallData = () => {
    if (!rainfallWsService) {
      console.error('WebSocket 服务未初始化');
      return;
    }
    rainfallWsService.send('/app/rainfall/grid');
  };

  // 初始化 WebSocket 回调
  onMounted(() => {
    // 创建 WebSocket 实例
    rainfallWsService = new WebSocketService();

    // 连接成功回调
    rainfallWsService.onConnected = () => {
      // 订阅降雨网格数据主题
      rainfallWsService!.subscribe<ApiResponse<RainfallGridResponse>>(
        '/topic/rainfall/grid/messages',
        (response) => {
          if (response.code === 200 && response.data) {
            // 显示图层
            addGridLayer(response.data);
          } else {
            console.warn('响应错误:', response.message);
          }
        }
      );

      // 连接成功后自动请求一次数据
      setTimeout(() => {
        requestRainfallData();
      }, 1000);
    };

    // 错误回调
    rainfallWsService.onError = (error) => {
      console.error('WebSocket 错误:', error);
    };

    // 自动连接
    rainfallWsService.connect();
  });

  onUnmounted(() => {
    // 销毁 WebSocket 实例
    if (rainfallWsService) {
      rainfallWsService.disconnect();
      rainfallWsService = null;
    }
  });

  // 监听显示隐藏
  watch(
    () => statusStore.weatherLayers.showRainfallGrid.show,
    (newValue: boolean) => {
      triggerLayerShowStatus(newValue);
    }
  );
</script>

<style scoped></style>
