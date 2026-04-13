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

export const useAdministrativeDivision = () => {
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
  const areaTransparency = 0.3;
  const labelTransparency = 1;

  return { areas, areasId, areasColor, areaTransparency, labelTransparency };
};
