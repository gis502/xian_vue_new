import type { CesiumInitOptions } from '@/types/cesium/CesiumInitOptions'
import type { EntityOptions } from '@/types/cesium/EntityOptions'
import type { PrimitiveOptions } from '@/types/cesium/PrimitiveOptions'
import type { LayerConfig } from '@/types/cesium/LayerConfig'
import {
  Viewer,
  Entity,
  Cartesian3,
  Color,
  PointGraphics,
  PolylineGraphics,
  BillboardGraphics,
  SceneMode,
  HeightReference,
  VerticalOrigin,
  HorizontalOrigin,
  Cartographic,
  ColorMaterialProperty,
  Ion,
  WebMapTileServiceImageryProvider,
  ImageryProvider,
  ImageryLayer,
  Math as CesiumMath,
  PolygonHierarchy,
  PolygonGraphics,
  ConstantProperty,
  Primitive,
  BillboardCollection,
  GeometryInstance,
  CircleGeometry,
  ColorGeometryInstanceAttribute,
  PerInstanceColorAppearance,
  PolylineGeometry,
  PolylineColorAppearance,
  PolygonGeometry,
  ArcGisMapServerImageryProvider,
  WebMapServiceImageryProvider,
  DataSource,
  LabelGraphics,
  LabelStyle,
  Cartesian2,
  JulianDate,
  ConstantPositionProperty,
  createWorldTerrain, GridMaterialProperty,
  GeoJsonDataSource
} from 'cesium'
import config from '@/config/config.json'
import type { LabelConfig } from '@/types/cesium/LabelConfig'
import type { CustomizeGeoJsonDataSource, GeoJsonOptions } from '@/types/cesium/GeoJsonOptions'

// 定义清除类型枚举
export type ClearType = 'default' | 'custom' | 'all'

/**
 * Cesium 工具类
 * 封装 Cesium 核心操作，区分默认/自定义资源管理
 */
export class CesiumUtils {
  // ===================== 定义viewer =====================
  #viewer: Viewer | null = null

  // ===================== 私有属性定义 =====================
  #defaultEntityIds = new Set<string>()
  #customEntityIds = new Set<string>()
  #defaultPrimitiveMap = new Map<string, Primitive | BillboardCollection>()
  #customPrimitiveMap = new Map<string, Primitive | BillboardCollection>()
  #defaultLayerMap = new Map<string, ImageryLayer>()
  #customLayerMap = new Map<string, ImageryLayer>()
  #defaultGeoJsonMap = new Map<string, DataSource>()
  #customGeoJsonMap = new Map<string, DataSource>()

  constructor() {
    Ion.defaultAccessToken = config.cesiumIonDefaultAccessToken
  }

  // ===================== 静态配置 ========================
  static readonly DEFAULT_OPTIONS: Required<GeoJsonOptions> = {
    showName: false,
    labelStyle: {
      labelFont: '16px "微软雅黑"',
      labelColor: Color.RED,
      backgroundColor: Color.BLACK,
      labelSize: 16,
      horizontalOrigin: HorizontalOrigin.CENTER,
      verticalOrigin: VerticalOrigin.CENTER,
      labelOffset: new Cartesian2(0, -10)
    },
    polygonStyle: {
      fill: true,
      fillColor: Color.RED.withAlpha(0.3),
      outline: true,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
    },
    polylineStyle: {
      width: 2,
      material: Color.BLUE,
      clampToGround: true,
    },
    pointStyle: {
      pixelSize: 8,
      color: Color.RED,
      outlineColor: Color.WHITE,
      outlineWidth: 2,
    },
    onComplete: () => { },
  };

  // ===================== 初始化与销毁 =====================

  /**
   * 初始化 Cesium Viewer
   */
  initCesiumViewer(options: CesiumInitOptions, tdMapToken?: string[], type: number = 0): void {
    const defaultOptions: CesiumInitOptions = {
      containerId: options.containerId,
      shouldAnimate: true,
      baseLayerPicker: false,
      timeline: false,
      animation: false,
      infoBox: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      homeButton: false,
      scene3DOnly: false,
      sceneModePicker: false,
      geocoder: false,
      sceneMode: SceneMode.SCENE3D,
    }

    const finalOptions = { ...defaultOptions, ...options }
    const container = document.getElementById(finalOptions.containerId)

    if (!container) {
      throw new Error(`Cesium 容器 #${finalOptions.containerId} 不存在`)
    }

    const viewer = new Viewer(container, {
      ...finalOptions,
      terrainProvider: createWorldTerrain(),
      selectionIndicator: false, // 禁用选择指示器
      baseLayerPicker: false,   // 禁用默认底图
      contextOptions: {
        webgl: {
          alpha: true,
          depth: false,
          stencil: true,
          antialias: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true,
        },
        allowTextureFilterAnisotropic: true,
      },
    })

    // 性能优化配置
    viewer.scene.globe.depthTestAgainstTerrain = false
    viewer.scene.fog.enabled = false
    viewer.scene.globe.enableLighting = false
    viewer.shadows = false
    const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
    creditContainer.style.display = 'none'

    // 添加底图
    this.imageryProvider(type, tdMapToken || config.tdMapToken).forEach((provider) => {
      viewer.imageryLayers.addImageryProvider(provider)
    })

    this.#viewer = viewer
  }

  /**
   * 销毁 Cesium Viewer
   */
  destroyCesiumViewer(): void {
    if (this.#viewer) {
      this.clearAllResources('all')
      this.#viewer.destroy()
    }
  }

  // ===================== 底图配置 =====================

  /**
   * 创建底图 ImageryProvider
   */
  private imageryProvider(type: number, tdMapToken: string[]): ImageryProvider[] {
    const option = {
      tileMatrixSetID: 'w',
      format: 'tiles',
      style: 'default',
      minimumLevel: 0,
      maximumLevel: 18,
      credit: 'Tianditu',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    }

    if (type === 0) {
      const token = tdMapToken[Math.floor(Math.random() * tdMapToken.length)]
      const imageryProvider = new WebMapTileServiceImageryProvider({
        url: `https://{s}.tianditu.gov.cn/img_w/wmts?tk=${token}`,
        layer: 'img',
        ...option,
      })
      const annotationProvider = new WebMapTileServiceImageryProvider({
        url: `https://{s}.tianditu.gov.cn/cia_w/wmts?tk=${token}`,
        layer: 'cia',
        ...option,
      })
      return [imageryProvider, annotationProvider]
    } else {
      const vectorProvider = new WebMapTileServiceImageryProvider({
        url: `https://{s}.tianditu.gov.cn/vec_w/wmts?tk=cc`,
        layer: 'vec',
        ...option,
      })
      return [vectorProvider]
    }
  }

  // ===================== 实体管理 =====================

  /**
   * 添加实体
   */
  addCesiumEntity(entityOptions: EntityOptions): Entity {
    const { id, position, attributes = {}, default: isDefault = false } = entityOptions

    if (!id) throw new Error('实体 id 为必填项')
    if (!position) throw new Error('实体 position 为必填项')
    this.#validateUniqueId(id)

    const entity = new Entity({
      id,
      position: this.convertPosition(position),
      ...attributes,
    })

    this.#configureEntityGraphics(entity, entityOptions)

    this.#viewer?.entities.add(entity)
    this.#storeEntityId(id, isDefault)
    return entity
  }

  /**
   * 查询实体
   */
  getCesiumEntityById(entityId: string): Entity | null {
    if (!this.#entityExists(entityId)) return null
    return this.#viewer?.entities.getById(entityId) || null
  }

  /**
   * 删除实体
   */
  removeCesiumEntity(entityId: string): boolean {
    if (!this.#entityExists(entityId)) {
      console.warn(`实体 ID ${entityId} 不存在`)
      return false
    }

    const entity = this.#viewer?.entities.getById(entityId)
    if (entity) {
      this.#viewer?.entities.remove(entity)
      this.#removeEntityId(entityId)
      return true
    }
    return false
  }

  /**
   * 批量删除实体
   */
  batchRemoveCesiumEntities(entityIds: string[]): void {
    entityIds.forEach((id) => this.removeCesiumEntity(id))
  }

  // ===================== Primitive 管理 =====================

  /**
   * 批量添加 Primitive
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
   */
  getPrimitiveById(id: string): Primitive | BillboardCollection | undefined {
    return this.#defaultPrimitiveMap.get(id) || this.#customPrimitiveMap.get(id)
  }

  /**
   * 删除 Primitive
   */
  removePrimitiveById(id: string): boolean {
    const { isDefault, primitive } = this.#getPrimitiveInfo(id)
    if (!primitive) {
      console.warn(`Primitive ID ${id} 不存在`)
      return false
    }

    this.#viewer?.scene.primitives.remove(primitive)
    this.#removePrimitiveId(id, isDefault)
    return true
  }

  // ===================== 图层管理 =====================

  /**
   * 创建图层
   */
  createLayer(layerConfig: LayerConfig): ImageryLayer | null {
    const { layers: layerKey, default: isDefault = false } = layerConfig

    if (!layerKey) throw new Error('layers 参数未定义')
    this.#validateUniqueLayerKey(layerKey)

    const provider = this.#createImageryProvider(layerConfig)
    if (!provider) return null

    const layer = this.#viewer?.imageryLayers.addImageryProvider(provider)
    this.#storeLayer(layerKey, layer!, isDefault)
    return layer!
  }

  /**
   * 查询图层
   */
  getLayerByKey(key: string): ImageryLayer | undefined {
    return this.#defaultLayerMap.get(key) || this.#customLayerMap.get(key)
  }

  /**
   * 删除图层
   */
  removeLayerByKey(key: string): boolean {
    const { isDefault, layer } = this.#getLayerInfo(key)
    if (!layer) {
      console.warn(`图层 key ${key} 不存在`)
      return false
    }

    const removed = this.#viewer?.imageryLayers.remove(layer, true)
    if (removed) {
      this.#removeLayerKey(key, isDefault)
    }
    return removed!
  }

  /**
   * 批量删除图层
   */
  batchRemoveLayers(layerIds: string[]): void {
    layerIds.forEach((id) => this.removeLayerByKey(id))
  }

  // ===================== GeoJSON 图层管理 =====================

  /**
   * 添加 GeoJSON 图层
   * @param layerId 图层唯一ID
   * @param geojsonData 数据源(路径/URL/对象)
   * @param isDefault 是否为默认图层
   * @param options 配置项(GeoJsonOptions)
   */
  async addGeoJsonLayer(
    layerId: string,
    geojsonData: CustomizeGeoJsonDataSource,
    isDefault: boolean = false,
    options?: GeoJsonOptions
  ): Promise<DataSource> {
    if (this.#exists(layerId)) throw new Error(`图层 ${layerId} 已存在`);
    const opt = this.#mergeOptions(options);

    // 加载并应用样式
    const dataSource = await GeoJsonDataSource.load(geojsonData);
    dataSource.entities.values.forEach(e => this.#applyStyle(e, opt));

    // 添加到地图
    await this.#viewer!.dataSources.add(dataSource);
    isDefault ? this.#defaultGeoJsonMap.set(layerId, dataSource) : this.#customGeoJsonMap.set(layerId, dataSource);

    // 如果需要显示标签，调用 addLabelsToDataSource
    if (opt.showName && opt.labelStyle) {
      this.addLabelsToDataSource(dataSource, {
        labelText: opt.labelStyle.labelText,
        labelFont: opt.labelStyle.labelFont,
        labelColor: opt.labelStyle.labelColor,
        labelSize: opt.labelStyle.labelSize,
        labelOffset: opt.labelStyle.labelOffset,
        horizontalOrigin: opt.labelStyle.horizontalOrigin,
        verticalOrigin: opt.labelStyle.verticalOrigin,
        backgroundColor: opt.labelStyle.backgroundColor,
        center: opt.labelStyle.center,
      });
    }

    opt.onComplete(dataSource);
    return dataSource;
  }

  /** 根据ID查询图层 */
  getGeoJsonLayerById(layerId: string): DataSource | undefined {
    return this.#getGeoJsonLayer(layerId).ds;
  }

  /** 删除图层 */
  removeGeoJsonLayer(layerId: string): boolean {
    const { isDefault, ds } = this.#getGeoJsonLayer(layerId);
    if (!ds) return false;

    const removed = this.#viewer!.dataSources.remove(ds, true);
    removed && (isDefault ? this.#defaultGeoJsonMap.delete(layerId) : this.#customGeoJsonMap.delete(layerId));
    return removed;
  }

  /**
   * 批量添加GeoJSON图层
   * @param layerIds 
   * @param geojsonDatas 
   * @param isDefaults 
   * @param options 
   */
  batchAddGeoJsonLayers(layerIds: string[], geojsonDatas: CustomizeGeoJsonDataSource[],
    isDefaults: boolean[], options?: GeoJsonOptions[]): void {
    layerIds.forEach((id, index) => this.addGeoJsonLayer(id, geojsonDatas?.[index], isDefaults?.[index], options?.[index]));
  }

  /** 批量删除 */
  batchRemoveGeoJsonLayers(layerIds: string[]): void {
    layerIds.forEach(id => this.removeGeoJsonLayer(id));
  }

  /** 清空图层 */
  clearAllGeoJsonLayers(clearType: ClearType = "custom"): void {
    const maps = {
      default: this.#defaultGeoJsonMap,
      custom: this.#customGeoJsonMap,
      all: new Map([...this.#defaultGeoJsonMap, ...this.#customGeoJsonMap])
    };

    maps[clearType].forEach(ds => this.#viewer!.dataSources.remove(ds, true));
    clearType === "all" ? (this.#defaultGeoJsonMap.clear(), this.#customGeoJsonMap.clear()) : maps[clearType].clear();
  }

  /** 显示图层 */
  showGeoJsonLayer(layerId: string): boolean {
    const ds = this.getGeoJsonLayerById(layerId);
    if (!ds) return false;
    ds.show = true;
    ds.entities.values.forEach(e => e.label && (e.label.show = new ConstantProperty(true)));
    return true;
  }

  /** 隐藏图层 */
  hideGeoJsonLayer(layerId: string): boolean {
    const ds = this.getGeoJsonLayerById(layerId);
    if (!ds) return false;
    ds.show = false;
    ds.entities.values.forEach(e => e.label && (e.label.show = new ConstantProperty(false)));
    return true;
  }

  /** 切换显隐 */
  toggleGeoJsonLayer(layerId: string): boolean | null {
    const ds = this.getGeoJsonLayerById(layerId);
    if (!ds) return null;
    const state = !ds.show;
    ds.show = state;
    ds.entities.values.forEach(e => e.label && (e.label.show = new ConstantProperty(state)));
    return state;
  }

  /** 批量显示 */
  batchShowGeoJsonLayers(layerIds: string[]): number {
    return layerIds.reduce((n, id) => n + (this.showGeoJsonLayer(id) ? 1 : 0), 0);
  }

  /** 批量隐藏 */
  batchHideGeoJsonLayers(layerIds: string[]): number {
    return layerIds.reduce((n, id) => n + (this.hideGeoJsonLayer(id) ? 1 : 0), 0);
  }

  /** 获取显示状态 */
  getGeoJsonLayerVisibility(layerId: string): boolean | null {
    const ds = this.getGeoJsonLayerById(layerId);
    return ds ? ds.show : null;
  }

  // ===================== EWKB操作 =====================

  /**
   * 添加 EWKB 解析后的 Cesium 实体
   * @param ewkb EWKB 十六进制字符串
   * @param entityOptions 实体配置项
   * @returns 添加后的 Cesium 实体
   */
  addEWkbLayer(ewkb: string, entityOptions: EntityOptions) {
    let height = 0
    if (Array.isArray(entityOptions.position)) {
      height = entityOptions.position[2] ?? 0
    } else if (entityOptions.position instanceof Cartesian3) {
      height = entityOptions.position.z ?? 0
    }

    // 解析 EWKB 获取几何类型和坐标
    const { type: geomType, coordinates } = this.parseEWKB(ewkb)

    // 根据几何类型配置实体
    switch (geomType) {
      case 'point': {
        // 断言坐标类型为点坐标
        const pointCoords = coordinates as [number, number]
        // 统一设置为数组类型（兼容接口）
        entityOptions.position = [pointCoords[0], pointCoords[1], height]
        break
      }

      case 'polyline': {
        // 断言坐标类型为线坐标
        const lineCoords = coordinates as [number, number][]

        // 初始化 polylineOptions（避免 undefined 报错）
        if (!entityOptions.polylineOptions) {
          entityOptions.polylineOptions = {
            positions: [],
            color: Color.BLUE,
            width: 3,
            clampToGround: false,
          }
        }

        // 转换坐标：补充高程，严格匹配 [number, number, number][] 类型
        entityOptions.polylineOptions.positions = lineCoords.map((coord) => [
          coord[0],
          coord[1],
          height,
        ]) as [number, number, number][]
        break
      }

      case 'polygon': {
        // 断言坐标类型为面坐标（兼容带洞多边形的嵌套结构）
        const polygonCoords = coordinates as [number, number][][] | [number, number][]

        // 初始化 polygonOptions（避免 undefined 报错）
        if (!entityOptions.polygonOptions) {
          entityOptions.polygonOptions = {
            hierarchy: [],
            outline: true,
            outlineColor: Color.BLACK,
            outlineWidth: 1,
            height: 0,
            extrudedHeight: 0,
          }
        }

        // 处理多边形坐标（兼容单层/双层数组）
        let finalPolygonCoords: [number, number, number][]
        if (Array.isArray(polygonCoords[0]) && typeof polygonCoords[0][0] === 'number') {
          // 单层数组（普通多边形）
          finalPolygonCoords = (polygonCoords as [number, number][]).map((coord) => [
            coord[0],
            coord[1],
            height,
          ]) as [number, number, number][]
        } else {
          // 双层数组（带洞多边形，取外环）
          const outerRing = (polygonCoords as [number, number][][])[0]
          finalPolygonCoords = outerRing?.map((coord) => [coord[0], coord[1], height]) as [
            number,
            number,
            number,
          ][]
        }

        entityOptions.polygonOptions.hierarchy = finalPolygonCoords
        break
      }

      default:
        throw new Error(`不支持的 EWKB 几何类型: ${geomType}`)
    }

    // 添加实体并返回
    return this.addCesiumEntity(entityOptions)
  }

  /**
   * 解析EWKB
   * @param ewkbHex
   * @returns
   */
  parseEWKB(ewkbHex: string): {
    type: 'point' | 'polyline' | 'polygon'
    coordinates: [number, number] | [number, number][] | [number, number][][]
    srid: number
    bbox?: [number, number, number, number]
  } {
    // 去掉可能的空格
    const hexString = ewkbHex.trim()

    if (!hexString || hexString.length < 2) {
      throw new Error('Invalid EWKB hex string')
    }

    // 将十六进制字符串转换为字节数组
    const bytes = []
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substr(i, 2), 16))
    }

    const dataView = new DataView(new Uint8Array(bytes).buffer)
    let offset = 0

    // 第一个字节：字节顺序 (0 = big-endian, 1 = little-endian)
    const byteOrder = dataView.getUint8(offset)
    const isLittleEndian = byteOrder === 1
    offset += 1

    // 读取类型码（4字节）
    let typeCode = dataView.getUint32(offset, isLittleEndian)
    offset += 4

    // 检查是否有SRID（如果类型码的第30位为1）
    let srid = 4326 // 默认WGS84
    const hasSRID = (typeCode & 0x20000000) !== 0

    if (hasSRID) {
      // 清除SRID标志位
      typeCode = typeCode & ~0x20000000
      // 读取SRID（4字节）
      srid = dataView.getUint32(offset, isLittleEndian)
      offset += 4
    }

    // 解析几何类型（取低16位）
    const geometryType = typeCode & 0xffff

    // 转换为您的类型系统
    let type: 'point' | 'polyline' | 'polygon'
    let coordinates: [number, number] | [number, number][] | [number, number][][]

    switch (geometryType) {
      case 1: // WKB_POINT
        type = 'point'
        coordinates = this.#parsePointCoords(dataView, offset, isLittleEndian)
        break

      case 2: // WKB_LINESTRING
        type = 'polyline'
        coordinates = this.#parseLineStringCoords(dataView, offset, isLittleEndian)
        break

      case 3: // WKB_POLYGON
        type = 'polygon'
        coordinates = this.#parsePolygonCoords(dataView, offset, isLittleEndian)
        break
      default:
        throw new Error(`Unsupported geometry type: ${geometryType}`)
    }

    // 计算边界框
    const bbox = this.#calculateBbox(type, coordinates)

    return {
      type: type,
      coordinates: coordinates,
      srid: srid,
      bbox: bbox,
    }
  }

  /**
   * 将地理数据转换为 WKB 十六进制字符串
   * @param type 几何类型 (point/polyline/polygon)
   * @param coordinates 坐标数据
   * @param srid 空间参考系ID (默认4326)
   * @param includeSRID 是否包含SRID信息（包含则为EWKB）
   * @param littleEndian 是否使用小端字节序 (默认true)
   * @returns WKB十六进制字符串
   */
  convertToWkb(
    type: 'point' | 'polyline' | 'polygon',
    coordinates: [number, number] | [number, number][] | [number, number][][],
    srid: number = 4326,
    includeSRID: boolean = true,
    littleEndian: boolean = true,
  ): string {
    // 验证坐标格式
    this.#validateCoordinates(type, coordinates)

    // 创建字节缓冲区（初始大小预估，后续会动态调整）
    const buffer = new ArrayBuffer(1024) // 初始分配1KB，足够大多数情况
    const dataView = new DataView(buffer)
    let offset = 0

    // 1. 写入字节序标识 (1字节)
    dataView.setUint8(offset, littleEndian ? 1 : 0)
    offset += 1

    // 2. 写入几何类型 (4字节)
    let typeCode: number
    switch (type) {
      case 'point':
        typeCode = 1
        break
      case 'polyline':
        typeCode = 2
        break
      case 'polygon':
        typeCode = 3
        break
      default:
        throw new Error(`不支持的几何类型: ${type}`)
    }

    // 如果包含SRID，设置EWKB标志位 (0x20000000)
    if (includeSRID) {
      typeCode |= 0x20000000
    }
    dataView.setUint32(offset, typeCode, littleEndian)
    offset += 4

    // 3. 写入SRID (如果需要)
    if (includeSRID) {
      dataView.setUint32(offset, srid, littleEndian)
      offset += 4
    }

    // 4. 写入坐标数据
    switch (type) {
      case 'point':
        this.#writePointCoordinates(dataView, offset, coordinates as [number, number], littleEndian)
        offset += 16 // 2个double（x,y）共16字节
        break
      case 'polyline':
        offset = this.#writeLineStringCoordinates(
          dataView,
          offset,
          coordinates as [number, number][],
          littleEndian,
        )
        break
      case 'polygon':
        offset = this.#writePolygonCoordinates(
          dataView,
          offset,
          coordinates as [number, number][][],
          littleEndian,
        )
        break
    }

    // 将缓冲区转换为十六进制字符串
    return this.#bufferToHexString(buffer, offset)
  }

  // ===================== 标签 =====================

  /**
   * 添加标签
   * @param dataSource
   * @param label
   */
  addLabelsToDataSource(dataSource: DataSource, label: LabelConfig): void {
    const entities = dataSource.entities.values

    entities.forEach((entity) => {
      const labelText = label?.labelText || 'name'

      const center: Cartesian3 | [number, number, number] =
        label.center || this.#calculateTheCenterPositionOfTheSurface(entity)

      // 设置中心位置
      entity.position = new ConstantPositionProperty(this.convertPosition(center))

      if (labelText && entity.position) {
        // 确保位置存在
        entity.label = new LabelGraphics({
          text: new ConstantProperty(labelText),
          font: new ConstantProperty(label?.labelFont || `${label?.labelSize || 16}px "微软雅黑"`),
          fillColor: new ConstantProperty(label?.labelColor || Color.WHITE),
          outlineColor: new ConstantProperty(Color.BLACK),
          outlineWidth: new ConstantProperty(1),
          style: new ConstantProperty(LabelStyle.FILL_AND_OUTLINE),
          pixelOffset: new ConstantProperty(new Cartesian2(label?.labelOffset?.x || 0, label?.labelOffset?.y || -20)),
          verticalOrigin: new ConstantProperty(label?.verticalOrigin || VerticalOrigin.CENTER),
          horizontalOrigin: new ConstantProperty(label?.horizontalOrigin || HorizontalOrigin.CENTER),
          showBackground: new ConstantProperty(true),
          backgroundColor: new ConstantProperty(label?.backgroundColor || Color.TRANSPARENT),
          backgroundPadding: new ConstantProperty(new Cartesian2(5, 3)),
          disableDepthTestDistance: new ConstantProperty(Number.POSITIVE_INFINITY),
        })
      }
    })
  }

  // ===================== 视角控制 =====================

  /**
   * 飞行到目标位置
   */
  flyToTarget(target: [number, number, number] | Cartesian3, duration = 2): void {
    const position = this.convertPosition(target)
    const cartographic = Cartographic.fromCartesian(position)
    this.#viewer!.camera.flyTo({
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
   */
  viewToTarget(target: [number, number, number] | Cartesian3): void {
    const position = this.convertPosition(target)
    this.#viewer?.camera.setView({
      destination: position,
      orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-90),
        roll: 0.0,
      },
    })
  }

  // ===================== 清除与资源管理 =====================

  /**
   * 清除实体
   */
  clearAllEntities(clearType: ClearType = 'custom'): void {
    const targetIds = this.#getTargetIdsByType(
      clearType,
      this.#defaultEntityIds,
      this.#customEntityIds,
    )

    targetIds.forEach((id) => {
      const entity = this.#viewer?.entities.getById(id)
      if (entity) this.#viewer?.entities.remove(entity)
    })

    this.#clearCollectionsByType(clearType, this.#defaultEntityIds, this.#customEntityIds)
  }

  /**
   * 清除 Primitive
   */
  clearAllPrimitives(clearType: ClearType = 'custom'): void {
    const targetMap = this.#getTargetMapByType(
      clearType,
      this.#defaultPrimitiveMap,
      this.#customPrimitiveMap,
    )

    targetMap.forEach((primitive) => {
      this.#viewer?.scene.primitives.remove(primitive)
    })

    this.#clearMapsByType(clearType, this.#defaultPrimitiveMap, this.#customPrimitiveMap)
  }

  /**
   * 清除图层
   */
  clearAllLayers(clearType: ClearType = 'custom'): void {
    const targetMap = this.#getTargetMapByType(
      clearType,
      this.#defaultLayerMap,
      this.#customLayerMap,
    )

    targetMap.forEach((layer) => {
      this.#viewer?.imageryLayers.remove(layer, true)
    })

    this.#clearMapsByType(clearType, this.#defaultLayerMap, this.#customLayerMap)
  }

  /**
   * 清除所有资源
   */
  clearAllResources(clearType: ClearType = 'custom'): void {
    this.clearAllEntities(clearType)
    this.clearAllPrimitives(clearType)
    this.clearAllLayers(clearType)
    this.clearAllGeoJsonLayers(clearType)
  }

  // ===================== getter 和 setter函数 =====================
  getViewer(): Viewer | null {
    return this.#viewer
  }

  // ===================== 辅助函数 =====================

  convertPosition(pos: Cartesian3 | [number, number, number]): Cartesian3 {
    return Array.isArray(pos) ? Cartesian3.fromDegrees(pos[0], pos[1], pos[2] || 0) : pos
  }



  convertPositionArray(positions: (Cartesian3 | [number, number, number])[]): Cartesian3[] {
    return positions.map((pos) => this.convertPosition(pos))
  }

  // ===================== 私有方法 =====================

  #configureEntityGraphics(entity: Entity, options: EntityOptions): void {
    switch (options.type) {
      case 'point': {
        const {
          color = Color.RED,
          pixelSize = 8,
          outlineColor = Color.WHITE,
          outlineWidth = 1,
          heightReference = HeightReference.CLAMP_TO_GROUND,
        } = options.pointOptions || {}
        entity.point = new PointGraphics({
          color,
          pixelSize,
          outlineColor,
          outlineWidth,
          heightReference,
        })
        break
      }
      case 'polyline': {
        const {
          positions,
          color = Color.BLUE,
          width = 3,
          clampToGround = false,
        } = options.polylineOptions || {}
        if (!positions) throw new Error('线实体必须传入 polylineOptions.positions')

        entity.polyline = new PolylineGraphics({
          positions: this.convertPositionArray(positions),
          material: new ColorMaterialProperty(color),
          width,
          clampToGround,
        })
        break
      }
      case 'billboard': {
        const {
          image,
          scale = 1,
          color = Color.WHITE,
          verticalOrigin = VerticalOrigin.CENTER,
          horizontalOrigin = HorizontalOrigin.CENTER,
          heightReference = HeightReference.CLAMP_TO_GROUND,
        } = options.billboardOptions || {}
        if (!image) throw new Error('Billboard 实体必须传入 billboardOptions.image')

        entity.billboard = new BillboardGraphics({
          image,
          scale,
          color,
          verticalOrigin,
          horizontalOrigin,
          heightReference,
        })
        break
      }
      case 'polygon': {
        const {
          hierarchy,
          // color = Color.GREEN.withAlpha(0.7),
          outline = true,
          outlineColor = Color.BLACK,
          outlineWidth = 1,
          height = 0,
          extrudedHeight,
          heightReference = HeightReference.CLAMP_TO_GROUND,
          material = new GridMaterialProperty({
            color: Color.GREEN.withAlpha(0.3), // 栅格线颜色
            cellAlpha: 0.2,                      // 栅格背景透明度
            lineCount: new Cartesian2(8, 8),     // 栅格线条数
            lineThickness: new Cartesian2(2.0, 2.0) // 线条粗细
          }),
        } = options.polygonOptions || {}

        if (!hierarchy) throw new Error('多边形实体必须传入 polygonOptions.hierarchy')

        entity.polygon = new PolygonGraphics({
          hierarchy: this.#createConstantProperty(this.#processHierarchy(hierarchy)),
          material: material,
          outline: this.#createConstantProperty(outline),
          outlineColor: this.#createConstantProperty(outlineColor),
          outlineWidth: this.#createConstantProperty(outlineWidth),
          height: this.#createConstantProperty(height),
          extrudedHeight:
            extrudedHeight !== undefined ? this.#createConstantProperty(extrudedHeight) : undefined,
          heightReference,
        })
        break
      }
      default:
        throw new Error(`不支持的实体类型：${options.type}`)
    }
  }

  #processHierarchy(
    hier: PolygonHierarchy | Cartesian3[] | [number, number][] | [number, number, number][],
  ): PolygonHierarchy {
    if (hier instanceof PolygonHierarchy) return hier
    if (!Array.isArray(hier) || hier.length < 3) {
      throw new Error('多边形层级必须是非空数组且至少 3 个顶点')
    }

    const positions = hier.map((pos) => {
      if (pos instanceof Cartesian3) return pos
      if (Array.isArray(pos) && pos.length >= 2) {
        return Cartesian3.fromDegrees(pos[0], pos[1], pos[2] || 0)
      }
      throw new Error(
        `无效坐标格式：${JSON.stringify(pos)}，应为 [经, 纬] 或 [经, 纬, 高] 或 Cartesian3`,
      )
    })

    return new PolygonHierarchy(positions)
  }

  #createConstantProperty(value: unknown): ConstantProperty {
    return new ConstantProperty(value)
  }

  #validateUniqueId(id: string): void {
    if (this.#defaultEntityIds.has(id) || this.#customEntityIds.has(id)) {
      throw new Error(`实体 ID ${id} 已存在`)
    }
  }

  #entityExists(id: string): boolean {
    return this.#defaultEntityIds.has(id) || this.#customEntityIds.has(id)
  }

  #storeEntityId(id: string, isDefault: boolean): void {
    if (isDefault) {
      this.#defaultEntityIds.add(id)
    } else {
      this.#customEntityIds.add(id)
    }
  }

  #removeEntityId(id: string): void {
    this.#defaultEntityIds.delete(id)
    this.#customEntityIds.delete(id)
  }

  #groupPrimitivesByType(primitives: PrimitiveOptions[]) {
    // 替换原第640行附近的代码段落为以下内容：
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
      // 验证图层是否已经存在
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
      const position = this.convertPosition(option.positions[0]!)
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

    this.#viewer?.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addPolylinePrimitives(options: PrimitiveOptions[]): void {
    const instances = options.map((option) => {
      const positions = this.convertPositionArray(option.positions)
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

    this.#viewer?.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addPolygonPrimitives(options: PrimitiveOptions[]): void {
    const instances = options.map((option) => {
      const positions = this.convertPositionArray(option.positions)
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

    this.#viewer?.scene.primitives.add(primitive)
    this.#storePrimitives(options, primitive)
  }

  #addBillboardPrimitives(options: PrimitiveOptions[]): void {
    const collection = new BillboardCollection()

    options.forEach((option) => {
      const position = this.convertPosition(option.positions[0]!)
      collection.add({
        id: option.id,
        position,
        image: option.image,
        scale: option.scale || 1,
        color: option.color || Color.WHITE,
      })
    })

    this.#viewer?.scene.primitives.add(collection)
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

  #validateUniqueLayerKey(key: string): void {
    if (this.#defaultLayerMap.has(key) || this.#customLayerMap.has(key)) {
      console.warn(`图层 ${key} 已存在，将覆盖原有图层`)
      this.removeLayerByKey(key)
    }
  }

  #createImageryProvider(layerConfig: LayerConfig): ImageryProvider | null {
    switch (layerConfig.type) {
      case 'imagery':
        return new ArcGisMapServerImageryProvider({ url: layerConfig.url })
      case 'wms':
        return new WebMapServiceImageryProvider({
          url: layerConfig.url,
          layers: layerConfig.layers,
          parameters: layerConfig.parameters || { format: 'image/png' },
        })
      case 'wmts':
        return new WebMapTileServiceImageryProvider({
          url: layerConfig.url,
          layer: layerConfig.layers,
          style: layerConfig.style || 'default',
          format: layerConfig.format || 'image/png',
          tileMatrixSetID: layerConfig.tileMatrixSetID || 'EPSG:4326',
          credit: '',
        })
      default:
        console.error(`不支持的图层类型：${layerConfig.type}`)
        return null
    }
  }

  #storeLayer(key: string, layer: ImageryLayer, isDefault: boolean): void {
    if (isDefault) {
      this.#defaultLayerMap.set(key, layer)
    } else {
      this.#customLayerMap.set(key, layer)
    }
  }

  #getLayerInfo(key: string) {
    const isDefault = this.#defaultLayerMap.has(key)
    const layer = isDefault ? this.#defaultLayerMap.get(key) : this.#customLayerMap.get(key)
    return { isDefault, layer }
  }

  #removeLayerKey(key: string, isDefault: boolean): void {
    if (isDefault) this.#defaultLayerMap.delete(key)
    else this.#customLayerMap.delete(key)
  }

  /** 图层是否存在 */
  #exists(layerId: string): boolean {
    return this.#defaultGeoJsonMap.has(layerId) || this.#customGeoJsonMap.has(layerId);
  }

  /** 合并用户配置 + 默认配置 */
  #mergeOptions(options?: GeoJsonOptions): Required<GeoJsonOptions> {
    return {
      ...CesiumUtils.DEFAULT_OPTIONS,
      ...options,
      labelStyle: { ...CesiumUtils.DEFAULT_OPTIONS.labelStyle, ...options?.labelStyle },
      polygonStyle: { ...CesiumUtils.DEFAULT_OPTIONS.polygonStyle, ...options?.polygonStyle },
      polylineStyle: { ...CesiumUtils.DEFAULT_OPTIONS.polylineStyle, ...options?.polylineStyle },
      pointStyle: { ...CesiumUtils.DEFAULT_OPTIONS.pointStyle, ...options?.pointStyle },
    };
  }

  /** 统一应用样式到实体 */
   #applyStyle(entity: Entity, options: Required<GeoJsonOptions>): void {
    const { polygonStyle, polylineStyle, pointStyle } = options;

    if (entity.point) {
      Object.assign(entity.point, {
        pixelSize: new ConstantProperty(pointStyle.pixelSize),
        color: new ConstantProperty(pointStyle.color),
        outlineColor: new ConstantProperty(pointStyle.outlineColor),
        outlineWidth: new ConstantProperty(pointStyle.outlineWidth),
      });
    }

    if (entity.polyline) {
      Object.assign(entity.polyline, {
        width: new ConstantProperty(polylineStyle.width),
        material: new ColorMaterialProperty(polylineStyle.material as Color),
        clampToGround: new ConstantProperty(polylineStyle.clampToGround),
      });
    }

    if (entity.polygon) {
      Object.assign(entity.polygon, {
        fill: new ConstantProperty(polygonStyle.fill),
        material: new ColorMaterialProperty(polygonStyle.fillColor as Color),
        outline: new ConstantProperty(polygonStyle.outline),
        outlineColor: new ConstantProperty(polygonStyle.outlineColor),
        outlineWidth: new ConstantProperty(polygonStyle.outlineWidth),
      });
    }
  }

  /** 获取图层信息 */
  #getGeoJsonLayer(layerId: string): { isDefault: boolean; ds: DataSource | undefined } {
    const def = this.#defaultGeoJsonMap.get(layerId);
    if (def) return { isDefault: true, ds: def };
    const custom = this.#customGeoJsonMap.get(layerId);
    return { isDefault: false, ds: custom };
  }

  #getTargetIdsByType(
    clearType: ClearType,
    defaultSet: Set<string>,
    customSet: Set<string>,
  ): Set<string> {
    const targetIds = new Set<string>()
    if (clearType === 'default' || clearType === 'all')
      defaultSet.forEach((id) => targetIds.add(id))
    if (clearType === 'custom' || clearType === 'all') customSet.forEach((id) => targetIds.add(id))
    return targetIds
  }

  #getTargetMapByType<T>(
    clearType: ClearType,
    defaultMap: Map<string, T>,
    customMap: Map<string, T>,
  ): Map<string, T> {
    const targetMap = new Map<string, T>()
    if (clearType === 'default' || clearType === 'all')
      defaultMap.forEach((value, key) => targetMap.set(key, value))
    if (clearType === 'custom' || clearType === 'all')
      customMap.forEach((value, key) => targetMap.set(key, value))
    return targetMap
  }

  #clearCollectionsByType(
    clearType: ClearType,
    defaultSet: Set<string>,
    customSet: Set<string>,
  ): void {
    if (clearType === 'default' || clearType === 'all') defaultSet.clear()
    if (clearType === 'custom' || clearType === 'all') customSet.clear()
  }

  #clearMapsByType<T>(
    clearType: ClearType,
    defaultMap: Map<string, T>,
    customMap: Map<string, T>,
  ): void {
    if (clearType === 'default' || clearType === 'all') defaultMap.clear()
    if (clearType === 'custom' || clearType === 'all') customMap.clear()
  }

  /**
   * 计算面要素的中心点作为标签位置
   * @param entity
   * @returns
   */
  #calculateTheCenterPositionOfTheSurface(entity: Entity): Cartesian3 {
    // 计算面要素的中心点作为标签位置
    if (entity.polygon) {
      // 获取面的层级坐标
      const hierarchy = entity.polygon.hierarchy?.getValue(JulianDate.now())
      if (hierarchy) {
        // 提取所有顶点坐标
        const positions = hierarchy.positions
        if (positions && positions.length > 0) {
          // 计算中心点（简单平均法，适用于大多数面要素）
          let lonSum = 0,
            latSum = 0,
            heightSum = 0
          positions.forEach((pos: Cartesian3) => {
            const cartographic = Cartographic.fromCartesian(pos)
            lonSum += cartographic.longitude
            latSum += cartographic.latitude
            heightSum += cartographic.height || 0
          })
          const centerLon = lonSum / positions.length
          const centerLat = latSum / positions.length
          const centerHeight = heightSum / positions.length + 100 // 轻微抬高避免被面遮挡
          // 返回中心点
          return Cartesian3.fromRadians(centerLon, centerLat, centerHeight)
        }
      }
    }
    return Cartesian3.ZERO
  }

  // 解析点坐标
  #parsePointCoords(dataView: DataView, offset: number, isLittleEndian: boolean): [number, number] {
    let currentOffset = offset

    // 读取X坐标（8字节，双精度浮点数）
    const x = dataView.getFloat64(currentOffset, isLittleEndian)
    currentOffset += 8

    // 读取Y坐标（8字节，双精度浮点数）
    const y = dataView.getFloat64(currentOffset, isLittleEndian)

    return [x, y]
  }

  // 解析3D点坐标（用于billboard）
  #parsePoint3DCoords(
    dataView: DataView,
    offset: number,
    isLittleEndian: boolean,
  ): [number, number] {
    let currentOffset = offset

    // 读取X坐标
    const x = dataView.getFloat64(currentOffset, isLittleEndian)
    currentOffset += 8

    // 读取Y坐标
    const y = dataView.getFloat64(currentOffset, isLittleEndian)
    currentOffset += 8

    return [x, y]
  }

  // 解析线坐标
  #parseLineStringCoords(
    dataView: DataView,
    offset: number,
    isLittleEndian: boolean,
  ): [number, number][] {
    let currentOffset = offset

    // 读取点的数量（4字节）
    const numPoints = dataView.getUint32(currentOffset, isLittleEndian)
    currentOffset += 4

    const coordinates: [number, number][] = []

    // 读取所有点
    for (let i = 0; i < numPoints; i++) {
      const x = dataView.getFloat64(currentOffset, isLittleEndian)
      currentOffset += 8

      const y = dataView.getFloat64(currentOffset, isLittleEndian)
      currentOffset += 8

      coordinates.push([x, y])
    }

    return coordinates
  }

  // 解析面坐标
  #parsePolygonCoords(
    dataView: DataView,
    offset: number,
    isLittleEndian: boolean,
  ): [number, number][][] {
    let currentOffset = offset

    // 读取环的数量（4字节）
    const numRings = dataView.getUint32(currentOffset, isLittleEndian)
    currentOffset += 4

    const coordinates: [number, number][][] = []

    // 读取所有环
    for (let ringIndex = 0; ringIndex < numRings; ringIndex++) {
      // 读取环中点的数量（4字节）
      const numPoints = dataView.getUint32(currentOffset, isLittleEndian)
      currentOffset += 4

      const ring: [number, number][] = []

      // 读取环中的所有点
      for (let i = 0; i < numPoints; i++) {
        const x = dataView.getFloat64(currentOffset, isLittleEndian)
        currentOffset += 8

        const y = dataView.getFloat64(currentOffset, isLittleEndian)
        currentOffset += 8

        ring.push([x, y])
      }

      coordinates.push(ring)
    }

    return coordinates
  }

  // 计算边界框
  #calculateBbox(
    type: string,
    coordinates: [number, number] | [number, number][] | [number, number][][],
  ): [number, number, number, number] | undefined {
    if (!coordinates) return undefined

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity

    const updateBbox = (x: number, y: number) => {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    switch (type) {
      case 'point':
      case 'billboard':
        // coordinates 是 [number, number]
        const coordsPoint = coordinates as [number, number]
        updateBbox(coordsPoint[0], coordsPoint[1])
        break

      case 'polyline':
        // coordinates 是 [number, number][]
        const coordsLine = coordinates as [number, number][]
        coordsLine.forEach((coord: [number, number]) => {
          updateBbox(coord[0], coord[1])
        })
        break

      case 'polygon':
        // coordinates 是 [number, number][][]
        const coordsPolygon = coordinates as [number, number][][]
        coordsPolygon.forEach((ring: [number, number][]) => {
          ring.forEach((coord: [number, number]) => {
            updateBbox(coord[0], coord[1])
          })
        })
        break
    }

    if (minX === Infinity) return undefined

    return [minX, minY, maxX, maxY]
  }

  /**
   * 验证坐标格式是否符合几何类型要求
   */
  #validateCoordinates(
    type: 'point' | 'polyline' | 'polygon',
    coordinates: [number, number] | [number, number][] | [number, number][][],
  ): void {
    switch (type) {
      case 'point':
        if (!Array.isArray(coordinates) || coordinates.length < 2) {
          throw new Error('点坐标必须是 [x, y] 格式的数组')
        }
        break
      case 'polyline':
        if (!Array.isArray(coordinates) || coordinates.length < 2) {
          throw new Error('线坐标必须包含至少2个点的数组')
        }
        const coordsLine = coordinates as [number, number][]
        coordsLine.forEach((coord: [number, number], idx: number) => {
          if (!Array.isArray(coord) || coord.length < 2) {
            throw new Error(`线坐标第${idx}个点格式错误，应为 [x, y]`)
          }
        })
        break
      case 'polygon':
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
          throw new Error('面坐标必须是包含至少一个环的数组')
        }
        const coordsPolygon = coordinates as [number, number][][]
        coordsPolygon.forEach((ring: [number, number][], ringIdx: number) => {
          if (!Array.isArray(ring) || ring.length < 4 || !this.#isRingClosed(ring)) {
            throw new Error(`面第${ringIdx}个环必须是至少4个点的闭合环`)
          }
          ring.forEach((coord: [number, number]) => {
            if (!Array.isArray(coord) || coord.length < 2) {
              throw new Error(`面环第${ringIdx}个点格式错误，应为 [x, y]`)
            }
          })
        })
        break
    }
  }

  /**
   * 检查面环是否闭合（首尾点是否相同）
   */
  #isRingClosed(ring: [number, number][]): boolean {
    const first = ring[0]
    const last = ring[ring.length - 1]
    return first![0] === last![0] && first![1] === last![1]
  }

  /**
   * 写入点坐标 (x, y 双精度浮点数)
   */
  #writePointCoordinates(
    dataView: DataView,
    offset: number,
    coord: [number, number],
    littleEndian: boolean,
  ): void {
    dataView.setFloat64(offset, coord[0], littleEndian) // x
    dataView.setFloat64(offset + 8, coord[1], littleEndian) // y
  }

  /**
   * 写入线坐标 (点数量 + 每个点坐标)
   */
  #writeLineStringCoordinates(
    dataView: DataView,
    offset: number,
    coords: [number, number][],
    littleEndian: boolean,
  ): number {
    // 写入点数量 (4字节)
    dataView.setUint32(offset, coords.length, littleEndian)
    offset += 4

    // 写入每个点坐标
    coords.forEach((coord) => {
      this.#writePointCoordinates(dataView, offset, coord, littleEndian)
      offset += 16 // 每个点16字节
    })
    return offset
  }

  /**
   * 写入面坐标 (环数量 + 每个环的点数量 + 每个点坐标)
   */
  #writePolygonCoordinates(
    dataView: DataView,
    offset: number,
    rings: [number, number][][],
    littleEndian: boolean,
  ): number {
    // 写入环数量 (4字节)
    dataView.setUint32(offset, rings.length, littleEndian)
    offset += 4

    // 写入每个环
    rings.forEach((ring) => {
      // 写入环的点数量 (4字节)
      dataView.setUint32(offset, ring.length, littleEndian)
      offset += 4

      // 写入环的每个点
      ring.forEach((coord) => {
        this.#writePointCoordinates(dataView, offset, coord, littleEndian)
        offset += 16
      })
    })
    return offset
  }

  /**
   * 将ArrayBuffer转换为十六进制字符串
   */
  #bufferToHexString(buffer: ArrayBuffer, byteLength: number): string {
    const uint8Array = new Uint8Array(buffer, 0, byteLength)
    return Array.from(uint8Array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  }
}

// 导出单例模式
export const CesiumUtilsSingleton = new CesiumUtils()