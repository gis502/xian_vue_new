<!-- 降雨栅格图层组件 -->
<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useStatusStore } from '@/stores/useStatusStore';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
  import { watch, onMounted, onBeforeUnmount } from 'vue';
  import { $api } from '@/api/api';
  import {
    Color,
    ColorGeometryInstanceAttribute,
    GeometryInstance,
    PolygonGeometry,
    PolygonHierarchy,
    Cartesian3,
    PerInstanceColorAppearance,
    GroundPrimitive,
  } from 'cesium';
  import type { RainfallFeature } from '@/types/rainstorm/RainfallGridResponse';

  const statusStore = useStatusStore();
  let primitiveCollection: GroundPrimitive | null = null;
  let isLoaded = false; // 标记数据是否已加载完成
  let pendingShow = false; // 标记是否有待显示的请求

  /**
   * 颜色缓存
   */
  const colorCache = new Map<string, Color>();

  /**
   * 解析颜色字符串
   */
  const parseColor = (colorStr: string): Color | null => {
    if (colorCache.has(colorStr)) {
      return colorCache.get(colorStr)!;
    }

    const match = colorStr.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (!match) return null;

    const r = parseInt(match[1]) / 255;
    const g = parseInt(match[2]) / 255;
    const b = parseInt(match[3]) / 255;
    const a = match[4] ? parseFloat(match[4]) : 1.0;

    const color = new Color(r, g, b, a);
    colorCache.set(colorStr, color);
    return color;
  };

  /**
   * 加载降雨栅格数据
   */
  const loadRainfallGrid = async () => {
    try {
      const res = await $api.meteorology.getRainfallGrid({
        time: '2025-08-20T12:00:00',
        resolution: 0.01,
      });

      const geoJsonData = res.data;

      if (geoJsonData && geoJsonData.type === 'FeatureCollection') {
        // 立即让出主线程，避免阻塞渲染
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // 分批处理，避免长时间阻塞主线程
        const features = geoJsonData.features;
        const batchSize = 500; // 每批处理500个
        const instances: GeometryInstance[] = [];

        for (let i = 0; i < features.length; i += batchSize) {
          const batch = features.slice(i, i + batchSize);

          batch.forEach((feature: RainfallFeature) => {
            if (!feature.geometry || !feature.geometry.coordinates) return;

            // 获取颜色
            let color = Color.WHITE;
            if (feature.properties?.color) {
              const parsedColor = parseColor(feature.properties.color);
              if (parsedColor) {
                color = parsedColor;
              }
            }

            // 转换坐标
            const coordinates = feature.geometry.coordinates[0];
            const positions = coordinates.map((coord: number[]) =>
              Cartesian3.fromDegrees(coord[0], coord[1], 0)
            );

            // 创建几何实例
            const instance = new GeometryInstance({
              geometry: new PolygonGeometry({
                polygonHierarchy: new PolygonHierarchy(positions),
                vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
              }),
              attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(color),
              },
            });

            instances.push(instance);
          });

          // 每批之间让出主线程
          if (i + batchSize < features.length) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }

        // 让出主线程
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // 创建 Primitive（初始状态为隐藏）
        primitiveCollection = new GroundPrimitive({
          geometryInstances: instances,
          appearance: new PerInstanceColorAppearance({
            flat: true, // 禁用光照计算
            translucent: true, // 支持半透明
          }),
          asynchronous: true, // 异步创建
          allowPicking: false, // 禁用拾取
          releaseGeometryInstances: true, // 释放几何实例内存
          interleave: true, // 交错顶点数据，提升GPU性能
          show: false, // 初始隐藏
        });

        // 添加到场景
        const viewer = CesiumUtilsSingleton.getViewer();
        if (viewer) {
          await viewer.scene.primitives.add(primitiveCollection);
        }

        // 标记为已加载
        isLoaded = true;

        // 如果有待显示的请求，立即显示
        if (pendingShow) {
          primitiveCollection.show = true;
          pendingShow = false;
        }
      }
    } catch (error) {
      console.error('加载降雨栅格数据失败:', error);
    }
  };

  // 组件挂载时立即检查并加载
  onMounted(async () => {
    // 始终预加载数据，无论当前 show 状态如何
    const layerIds = CesiumUtilsSingleton.getGeoJsonLayerIds('custom');
    if (!layerIds.has('rainfall-grid-layer')) {
      await loadRainfallGrid();
    }
  });

  // 监听显示隐藏状态
  watch(
    () => statusStore.weatherLayers.showRainfallGrid.show,
    async (newValue: boolean) => {
      if (newValue) {
        // 需要显示
        if (isLoaded && primitiveCollection) {
          // 数据已加载完成，直接显示
          primitiveCollection.show = true;
        } else if (!isLoaded) {
          // 数据还在加载中，标记为待显示
          pendingShow = true;
        }
      } else {
        // 需要隐藏
        if (primitiveCollection) {
          primitiveCollection.show = false;
        }
      }
    }
  );

  // 组件卸载时清理资源
  onBeforeUnmount(() => {
    if (primitiveCollection) {
      const viewer = CesiumUtilsSingleton.getViewer();
      if (viewer) {
        viewer.scene.primitives.remove(primitiveCollection);
      }
      primitiveCollection = null;
    }
    isLoaded = false;
    pendingShow = false;
  });
</script>

<style scoped></style>
