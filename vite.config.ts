import { defineConfig, Plugin } from 'vite'
import { resolve } from 'path'

// 自定义插件：为输出添加 shebang
function shebangPlugin(): Plugin {
  return {
    name: 'shebang',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          chunk.code = '#!/usr/bin/env node\n' + chunk.code
        }
      }
    },
  }
}

export default defineConfig({
  build: {
    // Node.js CLI 应用的打包配置
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    target: 'node18',
    ssr: true,
    rollupOptions: {
      // 外部化 Node.js 模块和依赖
      external: [
        'fs',
        'path',
        'url',
        'fs-extra',
        'ink',
        'react',
        'react/jsx-runtime',
        /^node:/,
      ],
    },
    minify: false,
    // 生成 sourcemap 便于调试
    sourcemap: true,
  },
  plugins: [shebangPlugin()],
  // 处理 React JSX
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
})
