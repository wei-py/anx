// 应用状态
export type AppStep =
  | 'menu'           // 主菜单
  | 'input-path'     // 输入 HBuilderX 项目路径
  | 'project-info'   // 显示项目信息
  | 'input-package'  // 输入包名
  | 'select-ads'     // 选择广告依赖
  | 'input-signing'  // 配置签名
  | 'confirm'        // 确认生成
  | 'generating'     // 生成中
  | 'done'           // 完成

// 项目信息
export interface ProjectInfo {
  id: string
  name: string
  versionName: string
  versionCode: number
  modules: string[]
  icons: Record<string, string>
}

// 签名配置
export interface SigningConfig {
  keystorePath: string
  keystorePassword: string
  keyAlias: string
  keyPassword: string
}

// 广告依赖选项
export interface AdDependency {
  id: string
  name: string
  selected: boolean
}

// 应用配置
export interface AppConfig {
  hbuilderxPath: string
  projectInfo: ProjectInfo | null
  packageName: string
  adDependencies: AdDependency[]
  signing: SigningConfig
}
