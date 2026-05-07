<!-- 学校组件 -->
<template>
  <div>
    <!-- 加载学校点位 -->
    <LoadingPoints
      v-if="statusStore.appLoadingCompleted && schoolList.length > 0"
      :base-points="schoolList"
      :get-disaster-icon="getDisasterIcon"
      :prefix="config.prefix.schoolPointId"
      :is-default="false"
      :loading-resource-field="LoadingResource.SCHOOL"
    />

    <!-- 显示信息框 -->
    <InformationBox
      :data="schoolDetail as Record<string, any>"
      :field="field"
      v-if="loadingInformationStore.school.loading"
      :title="informationBoxTitle"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :key="loadingInformationStore.school.id"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { $api } from '@/api/api.ts';
  import type { Point } from '@/types/base/Point.ts';
  import LoadingPoints from '@/component/common/LoadingPoints.vue';
  import config from '@/config/config.json';
  import InformationBox from '@/component/common/InformationBox.vue';
  import { useStatusStore } from '@/stores/useStatusStore.ts';
  import { useLoadingInformationStore } from '@/stores/useLoadingInformation.ts';
  import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils.ts';
  import { LoadingResource } from '@/types/common/LoadingResourceType.ts';
  import { useSchoolPoint } from '@/hooks/rain-earthquake/useSchoolPoint.ts';
  import { useLoadingResourceStore } from '@/stores/useLoadingResourceStore.ts';

  const schoolList = ref<Point[]>([]);

  const statusStore = useStatusStore();
  const loadingInformationStore = useLoadingInformationStore();
  const loadingResourceStore = useLoadingResourceStore();

  // 信息框相关配置
  const offsetX = ref(0);
  const offsetY = ref(0);
  const schoolDetail = ref<Point>();
  const informationBoxTitle = ref('');

  // 获取钩子函数
  const { field, getDisasterIcon } = useSchoolPoint();

  $api.schools.getBasePoints().then((res) => {
    schoolList.value = res.data;
  });

  // 监听id变化
  watch(
    () => loadingInformationStore.school.id,
    async (newId: number) => {
      if (newId === -1) {
        return;
      }
      // 获取学校数据
      const clickObject = loadingInformationStore.clickObject;

      if (!clickObject || !clickObject.primitive) {
        console.warn('点击对象或图元不存在');
        return;
      }

      const res = await $api.schools.getPointDetailById(
        loadingInformationStore.school.id
      );

      // 更新数据
      schoolDetail.value = res.data;
      informationBoxTitle.value = res.data.schoolName || '学校信息';

      try {
        // 将坐标转换为偏移量
        const screenPos = CesiumUtilsSingleton.convertScreenPosition(
          clickObject.primitive.position
        );
        offsetX.value = screenPos.x;
        offsetY.value = screenPos.y;

        // 显示新的信息框
        loadingInformationStore.school.loading = true;
      } catch (error) {
        throw new Error(`坐标转换失败:${error}`);
      }
    }
  );

  // 监听显示隐藏
  watch(
    () => statusStore.poiLayers.showSchool?.show,
    (newValue: boolean) => {
      if (newValue) {
        // 显示学校
        CesiumUtilsSingleton.batchShowPrimitives(
          loadingResourceStore.getLoadingResource(LoadingResource.SCHOOL)
            .ids
        );
      } else {
        // 隐藏学校
        CesiumUtilsSingleton.batchHidePrimitives(
          loadingResourceStore.getLoadingResource(LoadingResource.SCHOOL)
            .ids
        );
      }
    }
  );
</script>

<style scoped></style>
