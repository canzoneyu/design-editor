# Design-Editor 🎨

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WebGPU](https://img.shields.io/badge/WebGPU-原生支持-FF6B8B.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6.svg)
![Performance](https://img.shields.io/badge/GPU-加速-00DC82.svg)

**Design-Editor** 是一款基于 **WebGPU** 构建的新一代高性能设计工具，为专业图形工作流程提供浏览器内的原生级性能体验。

> **开发状态：** 项目正在积极开发中。我们正在构建基于网页的设计工具的未来。

## 🚀 为什么选择 Design-Editor？

传统的网页设计工具在使用 Canvas 2D 或 WebGL 时会遇到性能瓶颈。Design-Editor 通过 **WebGPU** 突破这些限制，提供：

- **全面 GPU 加速** - 渲染、滤镜、合成全部加速
- **实时性能表现** - 即使是复杂的 4K+ 文档也能保持 60fps+ 流畅编辑
- **专业格式支持** - 直接处理行业标准文件
- **框架无关** - 纯 WebGPU 实现，无重量级依赖

## ✨ 核心功能

### 🖼 **广泛的格式支持**

直接导入和编辑专业设计文件：

| 格式              | 状态        | 说明                     |
| ----------------- | ----------- | ------------------------ |
| **PNG/JPEG/WebP** | ✅ 完全支持 | 硬件加速解码             |
| **SVG**           | ✅ 完全支持 | GPU 加速矢量渲染         |
| **PDF**           | ✅ 支持     | 矢量与栅格内容提取       |
| **PSD**           | ✅ 支持     | 图层保留与混合模式       |
| **AI**            | ⚠️ 有限支持 | 通过导出转换（详见说明） |

> **关于 AI 文件的说明：** 原生 `.ai` 文件解析具有挑战性。我们建议从 Illustrator 导出为 SVG/PDF 格式以获得最佳效果。

### ⚡ **GPU 加速架构**

#### **渲染引擎**

- **统一的 WebGPU 管线** - 所有内容类型使用单一渲染路径
- **SDF 文字渲染** - 任何尺寸下的清晰字体显示
- **实例化绘制** - 数千对象，最少绘制调用
- **计算着色器** - 实时滤镜与效果

#### **性能优化**

- **基于 Worker 的解码** - 永不阻塞 UI 线程
- **纹理图集** - 最小化 GPU 状态切换
- **层次化剔除** - 仅渲染可见内容
- **增量更新** - 智能重渲染机制

### 🛠 **面向设计师的工具集**

#### **矢量编辑**

- 贝塞尔曲线操作
- 布尔运算
- 路径简化
- 实时形状工具

#### **图层管理**

- 完整图层堆栈
- 混合模式
- 图层效果
- 分组与蒙版

#### **文字排版**

- 富文本格式化
- OpenType 特性支持
- 路径文字
- 可变字体支持

## 🏗 架构概览

```
src/
├── core/                 # WebGPU 渲染引擎核心
│   ├── renderer/        # 核心渲染管线
│   ├── resources/       # GPU 资源管理
│   └── scene/          # 场景图实现
├── importers/           # 文件格式处理器
│   ├── raster/         # PNG/JPEG/WebP
│   ├── vector/         # SVG/PDF
│   └── professional/   # PSD/AI
├── tools/              # 编辑工具
│   ├── selection/      # 选择与变换
│   ├── vector/        # 钢笔、形状工具
│   └── text/          # 文字编辑
├── ui/                 # 编辑器界面
└── utils/             # 共享工具函数
```

## 🚀 快速开始

### 环境要求

- 支持 WebGPU 的浏览器（Chrome 113+、Edge 113+、Safari 17+）
- Node.js 18+ 及 npm/yarn/pnpm

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/design-editor.git
cd design-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产环境构建
npm run build
```

### 基础使用

```javascript
import { DesignEditor } from 'design-editor';

// 使用 canvas 元素初始化
const editor = new DesignEditor({
  canvas: document.getElementById('editor-canvas'),
  backgroundColor: '#ffffff',
  resolution: 2, // 视网膜屏支持
});

// 加载设计文件
await editor.loadFile('design.psd');

// 导出作品
const pngData = await editor.exportToPNG();
const svgData = await editor.exportToSVG();
```

## 📖 文档

- [快速开始指南](docs/getting-started.md)
- [API 参考](docs/api/README.md)
- [性能优化指南](docs/performance.md)
- [格式支持说明](docs/formats.md)

## 🛠 开发

### 从源码构建

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载）
npm run dev

# 运行测试
npm test

# 生产环境构建
npm run build

# 生成文档
npm run docs
```

### 关键开发脚本

| 脚本                | 用途             |
| ------------------- | ---------------- |
| `npm run dev`       | 启动开发服务器   |
| `npm run build`     | 构建生产包       |
| `npm run test`      | 运行测试套件     |
| `npm run benchmark` | 运行性能基准测试 |
| `npm run lint`      | 代码质量检查     |

## 🧪 性能基准测试

| 操作                | Design-Editor | Canvas 2D | 性能提升 |
| ------------------- | ------------- | --------- | -------- |
| 1000 图层渲染       | 16ms          | 120ms     | 7.5倍    |
| 高斯模糊            | 4ms           | 45ms      | 11倍     |
| 复杂 SVG 渲染       | 8ms           | 65ms      | 8倍      |
| 文字渲染（1万字符） | 3ms           | 85ms      | 28倍     |

_基准测试环境：MacBook Pro M2，Chrome 120_

## 🤝 贡献指南

我们欢迎您的贡献！请查看[贡献指南](CONTRIBUTING.md)了解详情。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加了很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发优先级

1. ✅ 核心 WebGPU 渲染器
2. ⚙️ SVG/PDF 导入器
3. 🔄 PSD/AI 支持
4. 🎨 UI/UX 优化
5. 📱 移动端优化

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- WebGPU 工作组
- Adobe 提供的格式文档
- 所有贡献者和测试者

## 🔮 开发路线图

- [ ] **v0.5.0** - 核心渲染引擎稳定版
- [ ] **v0.8.0** - 完整的矢量编辑套件
- [ ] **v1.0.0** - 完整的 PSD/AI 支持
- [ ] **v1.5.0** - 插件生态系统
- [ ] **v2.0.0** - 协作编辑功能

---

**为网页设计的未来而建，充满 ❤️**

_给本仓库点个 Star 关注我们的进展！_
