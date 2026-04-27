import type { Point } from '@/types/base/Point';
import type { PrimitiveOptions } from '@/types/cesium/PrimitiveOptions';
import { CesiumUtilsSingleton } from '@/utils/cesium/CesiumUtils';
import {
  Cartesian3,
  HorizontalOrigin,
  NearFarScalar,
  VerticalOrigin,
} from 'cesium';

/**
 * 公共批量处理点钩子函数
 * @returns 添加点的方法
 */
export const usePointsHandle = () => {
  /**
   * 批量添加点
   * @param points - 点数据数组
   * @param getDisasterIcon - 获取灾害图标的函数
   * @param prefix - 前缀
   * @param isDefault - 是否为默认图元，默认false
   * @returns 点的ID列表
   */
  function addPoints(
    points: Point[],
    getDisasterIcon: (disasterType?: string) => string,
    prefix: string,
    isDefault: boolean = false
  ): { ids: string[]; names: string[] } {
    // 设置加载配置
    const options: PrimitiveOptions[] = [];

    // 存放id、name
    const ids: string[] = [];
    const names: string[] = [];

    points.forEach((point) => {
      try {
        if (point.lon === undefined || point.lat === undefined) {
          throw new Error(`点位数据缺少经纬度:${point.id}`);
        }
        // 将经纬度转换为笛卡尔坐标，太高一点高度，方便点击
        const position = Cartesian3.fromDegrees(point.lon, point.lat, 10);

        const id = `${prefix}${point.id}`;
        const name = point.name!;
        ids.push(id);
        names.push(name);

        options.push({
          id: id,
          type: 'billboard',
          positions: [position],
          image: getDisasterIcon(point.disasterType),
          scale: 0.8,
          width: 40,
          isDefault: isDefault,
          scaleByDistance: new NearFarScalar(500, 1, 5e5, 0.3),
          customProperties: {
            verticalOrigin: VerticalOrigin.BOTTOM,
            horizontalOrigin: HorizontalOrigin.CENTER,
            height: 40,
          },
        });
      } catch (error) {
        throw new Error(`处理点位失败:${error}`);
      }
    });
    // 批量创建图层
    CesiumUtilsSingleton.addPrimitivesBatch(options);

    return { ids, names };
  }

  return { addPoints };
};
