import { WebGPURenderer } from './core/renderer/webgpu-renderer'
import { ResourceManager } from './core/resources/resource-manager'
import { SceneGraph } from './core/scene/scene-graph'
import { QuadRenderer } from './core/renderer/quad-renderer'

export interface DesignEditorOptions {
  canvas: HTMLCanvasElement
  backgroundColor?: string
  resolution?: number
  antialias?: boolean
}

export class DesignEditor {
  private renderer: WebGPURenderer
  private resourceManager: ResourceManager
  private sceneGraph: SceneGraph
  private quadRenderer: QuadRenderer | null = null
  
  private animationFrameId: number | null = null
  private isRendering: boolean = false
  private lastFrameTime: number = 0
  private fps: number = 0
  
  constructor(options: DesignEditorOptions) {
    // 初始化WebGPU渲染器
    this.renderer = new WebGPURenderer({
      canvas: options.canvas,
      powerPreference: 'high-performance',
      antialias: options.antialias ?? true
    })
    
    // 初始化资源管理器
    this.resourceManager = new ResourceManager(this.renderer)
    
    // 初始化场景图
    this.sceneGraph = new SceneGraph()
    
    // 设置背景颜色
    if (options.backgroundColor) {
      this.setBackgroundColor(options.backgroundColor)
    }
    
    // 开始渲染循环
    this.startRendering()
  }
  
  private setBackgroundColor(color: string): void {
    const canvas = this.renderer.getContext().canvas as HTMLCanvasElement
    canvas.style.backgroundColor = color
  }
  
  private async initializeRenderers(): Promise<void> {
    // 初始化四边形渲染器
    this.quadRenderer = new QuadRenderer(this.renderer, this.resourceManager)
  }
  
  private startRendering(): void {
    this.isRendering = true
    this.initializeRenderers().then(() => {
      this.renderLoop()
    })
  }
  
  private stopRendering(): void {
    this.isRendering = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
  
  private renderLoop = (timestamp: number = 0): void => {
    if (!this.isRendering) return
    
    // 计算FPS
    if (this.lastFrameTime > 0) {
      const delta = timestamp - this.lastFrameTime
      this.fps = Math.round(1000 / delta)
    }
    this.lastFrameTime = timestamp
    
    // 开始新的渲染帧
    const renderPass = this.renderer.beginFrame()
    
    // 获取投影和视图矩阵
    const projectionMatrix = this.renderer.getProjectionMatrix()
    const viewMatrix = this.renderer.getViewMatrix()
    
    // 渲染所有四边形
    if (this.quadRenderer) {
      this.quadRenderer.render(
        renderPass,
        projectionMatrix as unknown as Float32Array,
        viewMatrix as unknown as Float32Array
      )
    }
    
    // 结束渲染帧
    this.renderer.endFrame(renderPass)
    
    // 继续下一帧
    this.animationFrameId = requestAnimationFrame(this.renderLoop)
  }
  
  /**
   * 添加一个测试矩形
   */
  public addTestRectangle(id: string, x: number, y: number, width: number, height: number): void {
    const node = this.sceneGraph.createNode(id)
    node.setPosition(x, y)
    node.setScale(width, height)
    
    if (this.quadRenderer) {
      this.quadRenderer.addQuad(id, node)
    }
  }
  
  /**
   * 加载图片文件
   */
  public async loadImage(file: File | string): Promise<string> {
    let imageUrl: string
    
    if (file instanceof File) {
      imageUrl = URL.createObjectURL(file)
    } else {
      imageUrl = file
    }
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // 创建ImageBitmap
      const imageBitmap = await createImageBitmap(blob)
      
      // 创建纹理
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to create canvas context')
      }
      
      canvas.width = imageBitmap.width
      canvas.height = imageBitmap.height
      ctx.drawImage(imageBitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // 上传到GPU纹理
      const textureId = `image_${Date.now()}`
      this.resourceManager.createTexture(
        textureId,
        imageData.data,
        canvas.width,
        canvas.height,
        'rgba8unorm'
      )
      
      // 创建一个对应的场景节点
      const nodeId = `image_node_${Date.now()}`
      const node = this.sceneGraph.createNode(nodeId)
      node.setPosition(100, 100)
      node.setScale(imageBitmap.width, imageBitmap.height)
      
      return textureId
    } catch (error) {
      console.error('Failed to load image:', error)
      throw error
    } finally {
      if (file instanceof File) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }
  
  /**
   * 导出为PNG
   */
  public async exportToPNG(): Promise<Blob> {
    const canvas = this.renderer.getContext().canvas as HTMLCanvasElement
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to export PNG'))
        }
      }, 'image/png', 1.0)
    })
  }
  
  /**
   * 获取场景图
   */
  public getSceneGraph(): SceneGraph {
    return this.sceneGraph
  }
  
  /**
   * 获取资源管理器
   */
  public getResourceManager(): ResourceManager {
    return this.resourceManager
  }
  
  /**
   * 获取当前FPS
   */
  public getFPS(): number {
    return this.fps
  }
  
  /**
   * 销毁编辑器，释放所有资源
   */
  public dispose(): void {
    this.stopRendering()
    if (this.quadRenderer) {
      this.quadRenderer.dispose()
    }
    this.resourceManager.dispose()
  }
}

// 导出所有核心组件
export { WebGPURenderer, ResourceManager, SceneGraph, QuadRenderer }
export default DesignEditor