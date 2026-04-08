import {
  Primitive,
  BillboardCollection,
  GeometryInstance,
  CircleGeometry,
  ColorGeometryInstanceAttribute,
  PerInstanceColorAppearance,
  PolylineGeometry,
  PolylineColorAppearance,
  PolygonGeometry,
  PolygonHierarchy,
  Cartesian3,
  Color,
  BillboardGraphics,
  VerticalOrigin,
  HorizontalOrigin,
} from 'cesium'
import type { PrimitiveOptions } from '@/types/cesium/PrimitiveOptions'
import type { Viewer } from 'cesium'

/**
 * Primitive 管理器
 */
export class PrimitiveManager {
  #viewer: Viewer
  #defaultPrimitiveMap = new Map<string, Primitive | BillboardCollection>()
  #customPrimitiveMap = new Map<string, Primitive | BillboardCollection>()

  constructor(viewer: Viewer) {
    this.#viewer = viewer
  }

  /**
   * 批量添加 Primitive
   * @param primitives - Primitive 配置选项数组
   */
  addPrimitivesBatch(primitives: PrimitiveOptions[]): void {
    const grouped = this.#groupPrimitivesByType(primitives)

    if (grouped.points.length > 0) this.#addPointPrimitives(grouped.points)
    if (grouped.polylines.length > 0) this.#addPolylinePrimitives(grouped.polylines)
    if (grouped.polygons.length > 0) this.#addPolygonPrimitives(grouped.polygons)
    if (grouped.billboards.length > 0) this.#addBillboardPrimitives(grouped.billboards)
  }

  /**
   * 查询 Primitive
   * @param id - Primitive ID
   * @returns Primitive 或 BillboardCollection 实例，不存在则返回 undefined
   */
  getPrimitiveById(id: string): Primitive | BillboardCollection | undefined {
    return this.#defaultPrimitiveMap.get(id) || this.#customPrimitiveMap.get(id)
  }

  /**
   * 删除 Primitive
   * @param id - Primitive ID
   * @returns 是否删除成功
   */
  removePrimitiveById(id: string): boolean {
    const { isDefault, primitive } = this.#getPrimitiveInfo(id)
    if (!primitive) {
      console.warn(`Primitive ID ${id} 不存在`)
      return false
    }

    this.#viewer.scene.primitives.remove(primitive)
    this.#removePrimitiveId(id, isDefault)
    return true
  }

  /**
   * 清除 Primitive
   * @param clearType - 清除类型：'default'=默认 Primitive，'custom'=自定义 Primitive，'all'=所有 Primitive（默认 'custom'）
   */
  clearAllPrimitives(clearType: 'default' | 'custom' | 'all' = 'custom'): void {
    const targetMap = this.#getTargetMapByType(clearType)

    targetMap.forEach((primitive) => {
      this.#viewer.scene.primitives.remove(primitive)
    })

    this.#clearMapsByType(clearType)
  }

  /**
   * 获取所有Primitive ID
   * @param clearType - 类型：'default'=默认 Primitive，'custom'=自定义 Primitive，'all'=所有 Primitive（默认 'all'）
   * @returns Primitive ID 集合
   */
  getPrimitiveIds(clearType: 'default' | 'custom' | 'all' = 'all'): Set<string> {
    return this.#getTargetIdsByType(clearType)
  }

  // ===================== 私有方法 =====================

  #groupPrimitivesByType(primitives: PrimitiveOptions[]) {
    const grouped: {
      points: PrimitiveOptions[]
      polylines: PrimitiveOptions[]
      polygons: PrimitiveOptions[]
      billboards: PrimitiveOptions[]
    } = {
      points: [],
      polylines: [],
      polygons: [],
      billboards: [],
    }

    primitives.forEach((option) => {
      const { id } = option
      this.#validatePrimitiveUniqueId(id)

      switch (option.type) {
        case 'point':
          grouped.points.push(option)
          break
        case 'polyline':
          grouped.polylines.push(option)
          break
        case 'polygon':
          grouped.polygons.push(option)
          break
        case 'billboard':
          grouped.billboards.push(option)
          break
      }
    })

    return grouped
  }

  #validatePrimitiveUniqueId(id: string): void {
    if (this.#defaultPrimitiveMap.has(id) || this.#customPrimitiveMap.has(id)) {
      throw new Error(`Primitive ID ${id} 已存在`)
    }
  }

  #getPrimitiveInfo(id: string) {
    const isDefault = this.#defaultPrimitiveMap.has(id)
    const primitive = isDefault
      ? this.#defaultPrimitiveMap.get(id)
      : this.#customPrimitiveMap.get(id)
    return { isDefault, primitive }
  }

  #removePrimitiveId(id: string, isDefault: boolean): void {
    if (isDefault) {
      this.#defaultPrimitiveMap.delete(id)
    } else {
      this.#customPrimitiveMap.delete(id)
    }
  }

  #addPointPrimitives(options: PrimitiveOptions[]): void {
    const instances = options.map((option) => {
      const position = this.#convertPosition(option.positions[0]!)
      return new GeometryInstance({
        id: option.id,
        geometry: new CircleGeometry({
          center: position,
          radius: option.pixelSize || 8,
          vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(option.color || Color.RED),
        },
      })
    })

    const primitive = new Primitive({
      geometryInstances: instances,
      appearance: new PerInstanceColorAppearance({ translucent: false, closed: true }),
      asynchronous: false,
    })

    this.#viewer.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addPolylinePrimitives(options: PrimitiveOptions[]): void {
    const instances = options.map((option) => {
      const positions = this.#convertPositionArray(option.positions)
      return new GeometryInstance({
        id: option.id,
        geometry: new PolylineGeometry({
          positions,
          width: option.width || 3,
          vertexFormat: PolylineColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(option.color || Color.BLUE),
        },
      })
    })

    const primitive = new Primitive({
      geometryInstances: instances,
      appearance: new PolylineColorAppearance({ translucent: true }),
      asynchronous: false,
    })

    this.#viewer.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addPolygonPrimitives(options: PrimitiveOptions[]): void {
    const instances = options.map((option) => {
      const positions = this.#convertPositionArray(option.positions)
      return new GeometryInstance({
        id: option.id,
        geometry: new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(positions),
          vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(
            option.color || Color.GREEN.withAlpha(0.5),
          ),
        },
      })
    })

    const primitive = new Primitive({
      geometryInstances: instances,
      appearance: new PerInstanceColorAppearance({ translucent: true, closed: true }),
      asynchronous: false,
    })

    this.#viewer.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addBillboardPrimitives(options: PrimitiveOptions[]): void {
    const collection = new BillboardCollection()

    options.forEach((option) => {
      const position = this.#convertPosition(option.positions[0]!)
      collection.add({
        id: option.id,
        position,
        image: option.image,
        scale: option.scale || 1,
        color: option.color || Color.WHITE,
      })
    })

    this.#viewer.scene.primitives.add(collection)
    this.#storePrimitives(options, collection)
  }

  #storePrimitives(options: PrimitiveOptions[], primitive: Primitive | BillboardCollection): void {
    options.forEach((option) => {
      if (option.default) {
        this.#defaultPrimitiveMap.set(option.id, primitive)
      } else {
        this.#customPrimitiveMap.set(option.id, primitive)
      }
    })
  }

  #getTargetMapByType(
    clearType: 'default' | 'custom' | 'all',
  ): Map<string, Primitive | BillboardCollection> {
    const targetMap = new Map<string, Primitive | BillboardCollection>()
    if (clearType === 'default' || clearType === 'all')
      this.#defaultPrimitiveMap.forEach((value, key) => targetMap.set(key, value))
    if (clearType === 'custom' || clearType === 'all')
      this.#customPrimitiveMap.forEach((value, key) => targetMap.set(key, value))
    return targetMap
  }

  #clearMapsByType(clearType: 'default' | 'custom' | 'all'): void {
    if (clearType === 'default' || clearType === 'all') this.#defaultPrimitiveMap.clear()
    if (clearType === 'custom' || clearType === 'all') this.#customPrimitiveMap.clear()
  }

  #getTargetIdsByType(clearType: 'default' | 'custom' | 'all'): Set<string> {
    const targetIds = new Set<string>()
    if (clearType === 'default' || clearType === 'all')
      this.#defaultPrimitiveMap.forEach((_, key) => targetIds.add(key))
    if (clearType === 'custom' || clearType === 'all')
      this.#customPrimitiveMap.forEach((_, key) => targetIds.add(key))
    return targetIds
  }

  #convertPosition(pos: Cartesian3 | [number, number, number]): Cartesian3 {
    return Array.isArray(pos) ? Cartesian3.fromDegrees(pos[0], pos[1], pos[2] || 0) : pos
  }

  #convertPositionArray(positions: (Cartesian3 | [number, number, number])[]): Cartesian3[] {
    return positions.map((pos) => this.#convertPosition(pos))
  }
}
