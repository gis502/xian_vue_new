import type { Point } from "@/types/base/Point";
import type { PrimitiveOptions } from "@/types/cesium/PrimitiveOptions";
import { CesiumUtilsSingleton } from "@/utils/cesium/CesiumUtils";
import { Cartesian3, HorizontalOrigin, NearFarScalar, VerticalOrigin } from "cesium";
import config from '@/config/config.json'

/**
 * 公共批量处理点钩子函数
 */
export const usePointsHandle = () => {


    /**
     * 添加点
     * @param points - 点数据
     * @param getDisasterIcon - 获取灾害图标的函数
     * @returns 点的ID列表
     */
    function addPoints(points: Point[], getDisasterIcon: (disasterType: string) => string): string[] {
        // 设置加载配置
        const options: PrimitiveOptions[] = [];

        // 存放id
        const ids: string[] = [];

        points.forEach(point => {
            try {

                if (point.lon === undefined || point.lat === undefined || point.disasterType === undefined) {
                    throw new Error(`点位数据缺少经纬度或者灾害类型:${point.id}`);
                }
                // 将经纬度转换为笛卡尔坐标
                const position = Cartesian3.fromDegrees(point.lon, point.lat, 0);

                const id = `${config.prefix.hiddenDangerPointId}${point.id}`
                ids.push(id)

                options.push({
                    id: id,
                    type: 'billboard',
                    positions: [position],
                    image: getDisasterIcon(point.disasterType),
                    scale: 0.8,
                    width: 40,
                    isDefault: false,
                    scaleByDistance: new NearFarScalar(500, 1, 5e5, 0.3),
                    customProperties: {
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        horizontalOrigin: HorizontalOrigin.CENTER,
                        height: 40
                    },
                });
            } catch (error) {
                throw new Error(`处理点位失败:${point.id}`);
            }
        })

        // 批量创建图层
        CesiumUtilsSingleton.addPrimitivesBatch(options);

        return ids
    }

    return { addPoints}
}