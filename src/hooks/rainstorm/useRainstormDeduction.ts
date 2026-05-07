import { useLeftLegendStore } from '@/stores/useLeftLegendStore';
import { useStatusStore } from '@/stores/useStatusStore';
import { useStepStore } from '@/stores/useStepStore';

export const useRainstormDeduction = () => {
  const statusStore = useStatusStore();
  const leftLegendStore = useLeftLegendStore();
  const stepStore = useStepStore();
  /**
   * 显示步骤
   */
  const showStep = () => {
    statusStore.uiComponents.stepBar.show = true;
    stepStore.stepList = ['获取雨量', '模型计算', '灾害预警', '报告产出'];
  };

  /**
   * 添加图例
   */
  const addLegend = () => {
    leftLegendStore.legendListInfo.precipitation = {
      title: '降雨量图例',
      list: [
        {
          label: '无雨/微雨; <0.1mm/12h',
          color: 'rgba(200,200,200,0)',
        },
        {
          label: '小雨；<5mm/12h',
          color: 'rgba(0,0,255,0.4)',
        },
        {
          label: '中雨； <15mm/12h',
          color: 'rgba(0,255,255,0.5)',
        },
        {
          label: '大雨； <30mm/12h',
          color: 'rgba(0, 255, 0, 0.89)',
        },
        {
          label: '暴雨； <70mm/12h',
          color: 'rgba(255,255,0,0.7)',
        },
        {
          label: '大暴雨； <140mm/12h',
          color: 'rgba(255,165,0,0.8)',
        },
        {
          label: '特大暴雨； >140mm/12h',
          color: 'rgba(255,0,0,0.9)',
        },
      ],
    };
  };

  return { showStep, addLegend };
};
