<!-- 降雨栅格图层组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { $api } from '@/api/api';
  import { useRainstormDeduction } from '@/hooks/rainstorm/useRainstormDeduction';
  import { useStatusStore } from '@/stores/useStatusStore';
  import { useStepStore } from '@/stores/useStepStore';
  import type { ApiResponse } from '@/types/ApiResponse';
  import type { RainfallGridResponse } from '@/types/rainstorm/RainfallGridResponse';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { WebSocketService } from '@/utils/request/websocket';
  import { Utils } from '@/utils/utils';
  import { onMounted, onUnmounted, watch } from 'vue';

  let rainfallWsService: WebSocketService | null = null;
  const { triggerLayerShowStatus, addGridLayer } = useRainstormDeduction();
  const statusStore = useStatusStore();
  const stepStore = useStepStore();

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
            // 设置步骤为第一步
            stepStore.currentStep = 0;

            // 显示图层
            addGridLayer(response.data);

            // 推进到下一步
            stepStore.nextStep();

            // 进行模型计算
            $api.rainfall
              .modelDeduction({
                disaster_name: `${Utils.formatDate('YYYYMMDDHHmmss', new Date('2025-09-16 20:00:00'))}暴雨自动推演`,
                occurred_time: '2025-09-16 20:00:00',
                operation_type: '暴雨灾害链自动推演',
              })
              .then((res) => {
                // 进行预警
                CesiumUtilsSingleton.addPulseEffect(res.data.list);

                // 推进到下一步
                stepStore.nextStep();

                // 产出报告

                console.log(res);
              });
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
