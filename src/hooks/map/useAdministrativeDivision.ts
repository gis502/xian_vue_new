import {
  baQiao,
  beiLin,
  changAn,
  gaoLing,
  huYi,
  lanTian,
  lianHu,
  linTong,
  weiYang,
  xinCheng,
  yanLiang,
  yanTa,
  zhouZhi,
} from '@/assets';
import { Color } from 'cesium';

/**
 * 行政区划分相关钩子函数
 * @returns 行政区数据、ID、颜色及透明度配置
 */
export const useAdministrativeDivision = () => {
  /**
   * 行政区GeoJSON数据数组
   */
  const areas = [
    baQiao,
    beiLin,
    changAn,
    gaoLing,
    huYi,
    lanTian,
    lianHu,
    linTong,
    weiYang,
    xinCheng,
    yanLiang,
    yanTa,
    zhouZhi,
  ];
  /**
   * 行政区ID数组
   */
  const areasId = [
    'baqiao',
    'beilin',
    'changan',
    'gaoling',
    'huyi',
    'lantian',
    'lianhu',
    'lintong',
    'weiyang',
    'xincheng',
    'yanliang',
    'yanta',
    'zhouzhi',
  ];
  /**
   * 行政区颜色数组
   */
  const areasColor = [
    new Color(255 / 255, 153 / 255, 0 / 255),
    new Color(255 / 255, 51 / 255, 102 / 255),
    new Color(0 / 255, 178 / 255, 255 / 255),
    new Color(102 / 255, 255 / 255, 102 / 255),
    new Color(204 / 255, 102 / 255, 255 / 255),
    new Color(255 / 255, 204 / 255, 0 / 255),
    new Color(0 / 255, 204 / 255, 153 / 255),
    new Color(255 / 255, 102 / 255, 102 / 255),
    new Color(102 / 255, 153 / 255, 255 / 255),
    new Color(255 / 255, 178 / 255, 102 / 255),
    new Color(153 / 255, 255 / 255, 204 / 255),
    new Color(255 / 255, 153 / 255, 204 / 255),
    new Color(190 / 255, 255 / 255, 232 / 255),
  ];
  /**
   * 区域透明度
   */
  const areaTransparency = 0.3;
  /**
   * 标签透明度
   */
  const labelTransparency = 1;

  return { areas, areasId, areasColor, areaTransparency, labelTransparency };
};
