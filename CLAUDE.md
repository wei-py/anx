# ANX - uni-app-x Android 离线打包 CLI 工具

## 项目概述

交互式 CLI 工具，用于将 HBuilderX 编译的 uni-app-x 项目打包为可编译运行的 Android 项目。

## 技术栈

- **React + Ink** - 终端 UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **pnpm** - 包管理器

## 常用命令

```bash
pnpm dev      # 开发模式运行
pnpm build    # 构建到 dist/
pnpm start    # 运行构建后的 CLI
npm link      # 全局安装（可在任意目录运行 anx）
```

## 项目结构

```
src/
├── index.tsx           # CLI 入口
├── app.tsx             # 主应用组件（状态管理）
├── types.ts            # TypeScript 类型定义
├── components/         # UI 组件
│   ├── Menu.tsx        # 单选菜单 (jk 上下, Enter 确认)
│   ├── MultiSelect.tsx # 多选组件 (空格选择)
│   ├── Input.tsx       # 输入框
│   └── ProjectInfo.tsx # 项目信息展示
├── services/           # 业务逻辑
│   ├── parser.ts       # 解析 HBuilderX 产物
│   └── generator.ts    # 项目生成
└── config/
    └── dependencies.ts # Gradle 依赖映射表
```

## 核心功能

1. 读取 HBuilderX 编译产物 (`{项目}/unpackage/resources/app-android`)
2. 解析 `manifest.json` 提取应用信息
3. 基于官方 SDK 模板生成 Android 项目
4. 自动配置依赖、图标、签名

## 路径约定

| 路径类型 | 说明 |
|---------|------|
| HBuilderX 项目路径 | 用户输入，自动拼接 `/unpackage/resources/app-android` |
| SDK 模板 | `Android-uni-app-x-SDK@14196-4.87` (只读，不修改) |
| 输出目录 | 当前目录 + 应用ID |

## 交互按键

- `j/k` - 上下移动
- `空格` - 多选切换
- `Enter` - 确认
- `b` 或 `Ctrl+B` - 返回

## 注意事项

- SDK 模板目录 `Android-uni-app-x-SDK@14196-4.87` 为官方只读文件，仅拷贝使用
- 支持 Git Bash (MINGW64) 路径格式 (`/d/...` → `D:\...`)
