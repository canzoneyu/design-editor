import DesignEditor from '../../src/main'

interface LogEntry {
  time: string
  message: string
}

class DesignEditorApp {
  private editor: DesignEditor | null = null
  private logEntries: LogEntry[] = []
  private objectCount: number = 0
  
  constructor() {
    this.init()
  }
  
  private async init(): Promise<void> {
    // 检查WebGPU支持
    await this.checkWebGPUSupport()
    
    // 初始化编辑器
    await this.initEditor()
    
    // 设置事件监听器
    this.setupEventListeners()
    
    // 开始渲染循环
    this.startStatsUpdate()
    
    this.log('Application initialized successfully')
  }
  
  private async checkWebGPUSupport(): Promise<void> {
    const statusElement = document.getElementById('webgpu-status')
    
    if (!navigator.gpu) {
      this.updateStatus('❌ WebGPU is not supported in this browser', 'error')
      throw new Error('WebGPU not supported')
    }
    
    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        this.updateStatus('❌ Failed to get GPU adapter', 'error')
        throw new Error('No GPU adapter found')
      }
      
      const device = await adapter.requestDevice()
      device.destroy()
      
      this.updateStatus('✅ WebGPU is fully supported', 'success')
    } catch (error) {
      this.updateStatus('⚠️ WebGPU may have limited support', 'warning')
      console.warn('WebGPU limited support:', error)
    }
  }
  
  private updateStatus(message: string, type: 'success' | 'warning' | 'error'): void {
    const element = document.getElementById('webgpu-status')
    if (!element) return
    
    element.textContent = message
    element.style.color = type === 'success' ? '#28a745' : 
                         type === 'warning' ? '#ffc107' : 
                         '#dc3545'
  }
  
  private async initEditor(): Promise<void> {
    const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement
    
    if (!canvas) {
      throw new Error('Canvas element not found')
    }
    
    try {
      this.editor = new DesignEditor({
        canvas,
        backgroundColor: '#ffffff',
        resolution: window.devicePixelRatio || 1,
        antialias: true
      })
      
      this.log('Editor instance created')
      
      // 添加几个测试图形
      this.addTestShapes()
      
    } catch (error) {
      this.log(`Failed to initialize editor: ${error}`, 'error')
      throw error
    }
  }
  
  private addTestShapes(): void {
    if (!this.editor) return
    
    // 添加一些测试矩形
    const colors = [
      [1, 0, 0, 1],   // 红色
      [0, 1, 0, 1],   // 绿色
      [0, 0, 1, 1],   // 蓝色
      [1, 1, 0, 1],   // 黄色
      [1, 0, 1, 1]    // 紫色
    ]
    
    for (let i = 0; i < 5; i++) {
      const id = `rect_${i}`
      const x = 100 + i * 120
      const y = 100 + i * 80
      const width = 100 + Math.random() * 50
      const height = 100 + Math.random() * 50
      
      this.editor.addTestRectangle(id, x, y, width, height)
      this.objectCount++
    }
    
    this.updateObjectCounter()
    this.log('Added test shapes to canvas')
  }
  
  private setupEventListeners(): void {
    // 添加矩形按钮
    const addRectBtn = document.getElementById('add-rect-btn')
    if (addRectBtn) {
      addRectBtn.addEventListener('click', () => this.handleAddRectangle())
    }
    
    // 加载图片按钮
    const loadImageBtn = document.getElementById('load-image-btn')
    const imageInput = document.getElementById('image-input') as HTMLInputElement
    if (loadImageBtn && imageInput) {
      loadImageBtn.addEventListener('click', () => imageInput.click())
      imageInput.addEventListener('change', (e) => this.handleImageUpload(e))
    }
    
    // 导出按钮
    const exportBtn = document.getElementById('export-btn')
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.handleExport())
    }
    
    // 清空按钮
    const clearBtn = document.getElementById('clear-btn')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.handleClearCanvas())
    }
    
    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
      // 这里可以添加画布大小调整逻辑
      this.log('Window resized')
    })
  }
  
  private handleAddRectangle(): void {
    if (!this.editor) return
    
    const id = `rect_${Date.now()}`
    const x = 100 + Math.random() * 500
    const y = 100 + Math.random() * 300
    const width = 50 + Math.random() * 150
    const height = 50 + Math.random() * 150
    
    this.editor.addTestRectangle(id, x, y, width, height)
    this.objectCount++
    this.updateObjectCounter()
    
    this.log(`Added rectangle: ${id}`)
  }
  
  private async handleImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement
    if (!input.files || !this.editor) return
    
    const file = input.files[0]
    if (!file) return
    
    try {
      this.log(`Loading image: ${file.name}`)
      
      const textureId = await this.editor.loadImage(file)
      
      this.objectCount++
      this.updateObjectCounter()
      
      this.log(`Image loaded successfully: ${textureId}`)
    } catch (error) {
      this.log(`Failed to load image: ${error}`, 'error')
    }
    
    // 清空input以便再次选择同一文件
    input.value = ''
  }
  
  private async handleExport(): Promise<void> {
    if (!this.editor) return
    
    try {
      this.log('Exporting canvas as PNG...')
      
      const blob = await this.editor.exportToPNG()
      
      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `design-editor-export-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.log('Canvas exported successfully')
    } catch (error) {
      this.log(`Export failed: ${error}`, 'error')
    }
  }
  
  private handleClearCanvas(): void {
    if (!this.editor) return
    
    // 这里应该实现清理画布的逻辑
    // 目前只是重置计数器
    this.objectCount = 0
    this.updateObjectCounter()
    
    this.log('Canvas cleared')
  }
  
  private startStatsUpdate(): void {
    const updateStats = () => {
      if (this.editor) {
        // 更新FPS
        const fpsCounter = document.getElementById('fps-counter')
        if (fpsCounter) {
          fpsCounter.textContent = this.editor.getFPS().toString()
        }
      }
      
      // 更新内存使用情况（模拟）
      const memoryUsage = document.getElementById('memory-usage')
      if (memoryUsage) {
        const usedMB = (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024)
        memoryUsage.textContent = usedMB.toFixed(1)
      }
      
      requestAnimationFrame(updateStats)
    }
    
    updateStats()
  }
  
  private updateObjectCounter(): void {
    const counter = document.getElementById('object-counter')
    if (counter) {
      counter.textContent = this.objectCount.toString()
    }
  }
  
  private log(message: string, type: 'info' | 'error' = 'info'): void {
    const now = new Date()
    const timeString = now.toTimeString().split(' ')[0]
    
    const entry: LogEntry = {
      time: `[${timeString}]`,
      message
    }
    
    this.logEntries.push(entry)
    
    // 只保留最近10条日志
    if (this.logEntries.length > 10) {
      this.logEntries.shift()
    }
    
    // 更新日志显示
    this.updateLogDisplay()
    
    // 控制台输出
    if (type === 'error') {
      console.error(message)
    } else {
      console.log(message)
    }
  }
  
  private updateLogDisplay(): void {
    const logContainer = document.getElementById('activity-log')
    if (!logContainer) return
    
    logContainer.innerHTML = this.logEntries
      .map(entry => `
        <div class="log-entry">
          <span class="log-time">${entry.time}</span>
          <span class="log-message">${entry.message}</span>
        </div>
      `)
      .join('')
    
    // 滚动到底部
    logContainer.scrollTop = logContainer.scrollHeight
  }
  
  public destroy(): void {
    if (this.editor) {
      this.editor.dispose()
    }
    this.log('Application destroyed')
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  const app = new DesignEditorApp()
  
  // 将应用实例暴露给全局，便于调试
  ;(window as any).designEditorApp = app
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    app.destroy()
  })
})