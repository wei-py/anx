# ANX - uni-app-x Android 离线打包 CLI 工具

## 技术栈

- **React** - UI 逻辑
- **Ink** - 终端 UI 框架
- **Vite** - 构建工具
- **pnpm** - 包管理器
- **TypeScript** - 开发语言

---

## 核心功能

1. 读取 HBuilderX 编译产物，提取项目信息
2. 基于官方 SDK 模板生成可编译运行的 Android 项目
3. 自动配置依赖、图标、签名等

---

## 路径约定

| 路径 | 说明 |
|------|------|
| HBuilderX 项目路径 | 用户输入，CLI 自动拼接 `/unpackage/resources/app-android` |
| SDK 模板路径 | 当前项目的 `Android-uni-app-x-SDK@14196-4.87` (只读) |
| 输出目录 | 当前命令行路径 + 应用ID（文件夹名） |

---

## 从 HBuilderX 产物中提取的数据

路径：`{HBuilderX项目}/unpackage/resources/app-android`

### manifest.json
| 字段 | 说明 | 示例 |
|------|------|------|
| id | 应用 ID | `__UNI__HelloUniAppX` |
| name | 应用名称 | `Hello uni-app x` |
| version.name | 版本名 | `1.9.8` |
| version.code | 版本号 | `10908` |
| app-android.distribute.modules | 使用的模块 | `uni-payment`, `uni-location` 等 |
| app-android.distribute.icons | 图标配置 | `xxhdpi`, `xxxhdpi` |

### 其他文件
| 文件/目录 | 说明 |
|-----------|------|
| `www/` | 编译后的前端资源 |
| `package/*.png` | 应用图标文件 |
| `kotlin/` | 编译后的 Kotlin 代码 |

---

## 依赖配置

| 类型 | 说明 |
|------|------|
| 必须依赖 | 19个基础依赖，始终包含 |
| 广告依赖 | 10个可选，交互时空格多选 |
| 模块依赖 | 根据 manifest.json 中的 modules 动态添加 |

---

## CLI 交互流程

```
┌─────────────────────────────────────────┐
│  ANX - uni-app-x Android 离线打包工具   │
└─────────────────────────────────────────┘

操作按键：jk 上下移动 | 空格 多选 | Enter 确认 | b 返回

1. 选择操作
   > 创建新项目
     从现有项目更新
     退出

2. 输入 HBuilderX 项目路径
   > 请输入路径: /path/to/my-uniapp-project

3. 解析项目信息（自动显示）
   ┌─────────────────────────────────┐
   │ 应用名称: Hello uni-app x       │
   │ 应用ID: __UNI__HelloUniAppX     │
   │ 版本: 1.9.8 (10908)             │
   │ 模块: 支付、定位、推送...        │
   └─────────────────────────────────┘

4. 配置 Android 项目
   > 包名 (applicationId): com.example.myapp

5. 选择广告依赖（空格选择，jk 上下移动，Enter 确认）
   [ ] 华为广告
   [x] 穿山甲广告
   [ ] 优量汇广告
   ...

6. 配置签名信息
   > keystore 路径: ./my.keystore
   > keystore 密码: ****
   > key 别名: mykey
   > key 密码: ****

7. 确认生成
   > 确认
     返回修改
     取消

8. 生成完成
   ✓ 项目已生成到: ./__UNI__HelloUniAppX
```

---

## 实现步骤

### 第一阶段：项目初始化
1. 初始化 pnpm 项目
2. 配置 Vite + React + Ink
3. 创建基础 CLI 入口

### 第二阶段：交互界面
1. 实现 vim 风格导航组件 (jk 上下, 空格多选, Enter 确认, b 返回)
2. 实现菜单选择组件（单选）
3. 实现多选组件（广告依赖）
4. 实现输入框组件
5. 实现信息展示组件

### 第三阶段：核心功能
1. **路径解析模块**
   - 验证 HBuilderX 产物目录
   - 读取并解析 manifest.json
   - 解析图标资源

2. **模板管理模块**
   - 读取官方 SDK 模板（只读，不修改原文件）
   - 完整拷贝到输出目录

3. **项目生成模块**
   - 复制 www 资源到 `uniappx/src/main/assets/apps/{appId}/www`
   - 更新 `app/build.gradle`（applicationId, versionCode, versionName, 签名配置）
   - 更新 `app/src/main/res/values/strings.xml`（app_name）
   - 复制图标到 `app/src/main/res/mipmap-*/`
   - 根据 modules 和用户选择配置 Gradle 依赖

### 第四阶段：优化
1. 错误处理和提示
2. 进度显示
3. 启动页处理（后期）

---

## 项目目录结构

```
anx/
├── src/
│   ├── index.tsx              # CLI 入口
│   ├── app.tsx                # 主应用组件
│   ├── components/            # UI 组件
│   │   ├── Menu.tsx           # 单选菜单
│   │   ├── MultiSelect.tsx    # 多选组件
│   │   ├── Input.tsx          # 输入框
│   │   └── ProjectInfo.tsx    # 项目信息展示
│   ├── services/              # 业务逻辑
│   │   ├── parser.ts          # 解析 HBuilderX 产物
│   │   ├── template.ts        # 模板管理
│   │   └── generator.ts       # 项目生成
│   ├── config/                # 配置
│   │   └── dependencies.ts    # 依赖映射表
│   └── utils/                 # 工具函数
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 常见问题

### 1. 如何全局运行？如何打包？

**打包：**
```bash
pnpm build        # 构建到 dist/index.js
```

**全局安装（本地测试）：**
```bash
npm link          # 创建全局软链接
# 或
pnpm link --global
```

安装后可在任意目录运行：
```bash
anx
```

**发布到 npm：**
```bash
npm publish       # 发布到 npm
npm install -g anx  # 其他人安装
```

### 2. Mac 和 Windows 都兼容吗？

**是的，完全兼容！**

| 组件 | 兼容性 |
|------|--------|
| Node.js 运行时 | ✅ 跨平台 |
| Ink (终端 UI) | ✅ 跨平台 |
| fs-extra 文件操作 | ✅ 跨平台 |
| `path` 模块 | ✅ 自动处理路径分隔符 |

**已处理的兼容性问题：**
- Git Bash (MINGW64) 路径格式：`/d/workspace/...` → `D:\workspace\...`
- 使用 `path.join()` 确保路径分隔符正确

1. keystore 路径，输入完后，到keystore 密码时把keystore 路径的值也带过了？后面的key 别名和key密码也是
2. 还有keystore生成的路径，直接就是生成模版项目的根目录就行了，只需要我输入命名就行