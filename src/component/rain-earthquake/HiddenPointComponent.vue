<!-- 隐患点组件 -->
<template>
  <div>
    <!-- 加载基础隐患点 -->
    <LoadingPoints v-if="useViewerStore().getViewerLoadingCompleted() && baseHiddenPoints.length > 0" :base-points="baseHiddenPoints"
      :get-disaster-icon="getDisasterIcon" />

    <!-- 显示信息框 -->
    <InformationBox 
      :data='hiddenDangerPointDetail as Record<string, any>' 
      :field="field"
      v-if="showInformationBox" 
      :title="informationBoxTitle" 
      :offset-x="offsetX" 
      :offset-y="offsetY"
      :key="clickHiddenDangerPointId" />
  </div>
</template>

<script setup lang="ts">
import { DisasterType } from "@/types/common/DisasterType";
import { ref } from "vue";
import { $api } from "@/api/api.ts";
import type { Point } from "@/types/base/Point";
import LoadingPoints from "@/component/rain-earthquake/LoadingPoints.vue";
import landslide from '@/assets/images/icon/landslide.png';
import debrisFlow from '@/assets/images/icon/debris-flow.png';
import flashFlood from '@/assets/images/icon/flash-flood.png';
import waterlogging from '@/assets/images/icon/waterlogging.png';
import { CesiumUtilsSingleton } from "@/utils/cesium/CesiumUtils";
import config from '@/config/config.json'
import InformationBox from "@/component/common/InformationBox.vue";
import type { Billboard } from "cesium";
import { useViewerStore } from "@/stores/useViewerStore";


const props = defineProps<{
  disasterType: DisasterType
}>()

const baseHiddenPoints = ref<Point[]>([]);

const clickHiddenDangerPointId = ref(-1);

const showInformationBox = ref(false);
const informationBoxTitle = ref('')
const offsetX = ref(0)
const offsetY = ref(0)
const hiddenDangerPointDetail = ref<Point>()

const field = {
  fieldCode: '野外编号',
  disasterName: '灾害点名称',
  position: '位置',
  disasterType: '灾害类型',
  scaleGrade: '规模等级',
  riskGrade: '风险等级'
}

$api.hiddenDangerSpots.getBasePoins(props.disasterType).then((res) => {
  baseHiddenPoints.value = res.data
})

CesiumUtilsSingleton.clickLayer(async (pickedObject: object) => {
  const obj: { id: string, primitive: Billboard } = pickedObject as { id: string, primitive: Billboard }

  if (obj && Object.hasOwn(obj, 'id') && (typeof obj.id == 'string') && obj.id.includes(config.prefix.hiddenDangerPointId)) {
    const matchResult = obj.id.match(/\d+$/)
    clickHiddenDangerPointId.value = matchResult ? parseInt(matchResult[0]) : -1

    try {
      // 先隐藏旧的信息框
      showInformationBox.value = false
      
      // 获取隐患点数据
      const res = await $api.hiddenDangerSpots.getPointDetailById(clickHiddenDangerPointId.value)
      
      // 等待一帧，确保旧组件已销毁
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // 更新数据
      hiddenDangerPointDetail.value = res.data
      informationBoxTitle.value = res.data.disasterType + '隐患点'

      // 将坐标转换为偏移量
      const screenPos = CesiumUtilsSingleton.convertScreenPosition(obj.primitive.position)
      offsetX.value = screenPos.x
      offsetY.value = screenPos.y
      
      // 显示新的信息框
      showInformationBox.value = true
    } catch (error) {
      showInformationBox.value = false
      throw new Error(`获取隐患点数据失败: ${error}`);
    }
  } else {
    showInformationBox.value = false
    clickHiddenDangerPointId.value = -1
  }
})
</script>

<script lang="ts">
function getDisasterIcon(disasterType: string): string {
  switch (disasterType) {
    case '滑坡':
      return landslide
    case '泥石流':
      return debrisFlow
    case '内涝':
      return flashFlood
    case "山洪":
      return waterlogging
    default:
      throw new Error(`未知的灾害类型: ${disasterType}`);
  }
}
</script>

<style scoped></style>
