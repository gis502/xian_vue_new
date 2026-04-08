import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
} from 'cesium'
import type { Viewer } from 'cesium'

/**
 * 相机控制器
 */
export class CameraController {
  #viewer: Viewer

  constructor(viewer: Viewer) {
    this.#viewer = viewer
  }

  /**
   * 飞行到目标位置
   * @param target - 目标位置 [经度, 纬度, 高度] 或 Cartesian3
   * @param duration - 飞行持续时间（秒，默认 2）
   */
  flyToTarget(target: [number, number, number] | Cartesian3, duration = 2): void {
    const position = this.#convertPosition(target)
    const cartographic = Cartographic.fromCartesian(position)
    this.#viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude),
        cartographic.height,
      ),
      duration,
    })
  }

  /**
   * 调整视角到目标位置
   * @param target - 目标位置 [经度, 纬度, 高度] 或 Cartesian3
   */
  viewToTarget(target: [number, number, number] | Cartesian3): void {
    const position = this.#convertPosition(target)
    this.#viewer?.camera.setView({
      destination: position,
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-90),
        roll: 0.0,
      },
    })
  }

  // ===================== 私有方法 =====================

  #convertPosition(pos: Cartesian3 | [number, number, number]): Cartesian3 {
    return Array.isArray(pos) ? Cartesian3.fromDegrees(pos[0], pos[1], pos[2] || 0) : pos
  }
}
