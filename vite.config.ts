import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'DesignEditor',
      fileName: (format) => `design-editor.${format}.js`,
      formats: ['es', 'umd', 'cjs']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['gl-matrix'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'gl-matrix': 'glMatrix'
        }
      }
    },
    sourcemap: true,
    minify: false // 开发阶段关闭压缩便于调试
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/examples/**/*']
    })
  ],
  server: {
    port: 5173,
    open: true
  }
})