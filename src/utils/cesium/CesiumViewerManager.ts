import {
  Viewer,
  SceneMode,
  Ion,
  WebMapTileServiceImageryProvider,
  ImageryProvider,
  createWorldTerrain,
} from 'cesium'
import type { CesiumInitOptions } from '@/types/cesium/CesiumInitOptions'
import config from '@/config/config.json'

/**
 * Cesium Viewer 管理器
 */
export class CesiumViewerManager {
  #viewer: Viewer | null = null
  #currentTokenIndex: number = 0
  #failedTokens: Set<number> = new Set()

  constructor() {
    this.#initializeToken()
  }

  /**
   * 初始化并设置有效的 Token
   */
  #initializeToken(): void {
    const tokens = config.cesiumIonDefaultAccessToken
    if (!Array.isArray(tokens) || tokens.length === 0) {
      console.warn('Cesium Ion Token 配置为空')
      return
    }

    Ion.defaultAccessToken = tokens[this.#currentTokenIndex]
  }

  /**
   * 切换到下一个可用的 Token
   * @returns 是否成功切换
   */
  #switchToNextToken(): boolean {
    const tokens = config.cesiumIonDefaultAccessToken
    if (!Array.isArray(tokens) || tokens.length <= 1) {
      return false
    }

    this.#failedTokens.add(this.#currentTokenIndex)

    for (let i = 1; i < tokens.length; i++) {
      const nextIndex = (this.#currentTokenIndex + i) % tokens.length
      if (!this.#failedTokens.has(nextIndex)) {
        this.#currentTokenIndex = nextIndex
        Ion.defaultAccessToken = tokens[nextIndex]
        console.log(`已切换到 Cesium Ion Token #${nextIndex + 1}`)
        return true
      }
    }

    console.warn('所有 Cesium Ion Token 均已失效')
    return false
  }
  /**
   * 初始化 Cesium Viewer
   * @param options - Viewer 初始化选项
   * @param tdMapToken - 天地图 Token 数组（可选）
   * @param type - 底图类型：0=影像图，1=矢量图（默认 0）
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
      terrainProvider: createWorldTerrain({
        requestVertexNormals: false,
        requestWaterMask: false,
      }),
      selectionIndicator: false,
      baseLayerPicker: false,
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
    viewer.scene.globe.showGroundAtmosphere = false
    viewer.scene.skyBox.show = false
    const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
    creditContainer.style.display = 'none'

    // 添加底图
    this.#createImageryProviders(type, tdMapToken || config.tdMapToken).forEach((provider) => {
      viewer.imageryLayers.addImageryProvider(provider)
    })

    this.#viewer = viewer
  }

  /**
   * 销毁 Cesium Viewer
   * @param clearAllResources - 清理所有资源的回调函数
   */
  destroyCesiumViewer(clearAllResources: () => void): void {
    if (this.#viewer) {
      clearAllResources()
      this.#viewer.destroy()
      this.#viewer = null
    }
  }

  /**
   * 获取 Viewer 实例
   * @returns Viewer 实例，如果未初始化则返回 null
   */
  getViewer(): Viewer | null {
    return this.#viewer
  }

  /**
   * 创建底图 ImageryProvider
   */
  #createImageryProviders(type: number, tdMapToken: string[]): ImageryProvider[] {
    const option = {
      tileMatrixSetID: 'w',
      format: 'tiles',
      style: 'default',
      minimumLevel: 0,
      maximumLevel: 18,
      credit: 'Tianditu',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    }

    const token = tdMapToken[Math.floor(Math.random() * tdMapToken.length)]

    if (type === 0) {
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
        url: `https://{s}.tianditu.gov.cn/vec_w/wmts?tk=${token}`,
        layer: 'vec',
        ...option,
      })
      return [vectorProvider]
    }
  }
}
