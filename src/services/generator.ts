import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import type { AppConfig } from '../types.js'
import { requiredDependencies, adDependencies, moduleDependencies } from '../config/dependencies.js'

// 获取当前脚本所在目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SDK 模板路径 (相对于 anx 安装目录)
// 通过 import.meta.url 定位，确保全局安装后也能找到
function getSDKTemplatePath(): string {
  // dist/index.js -> 上1级到项目根目录
  const projectRoot = path.resolve(__dirname, '..')
  return path.join(projectRoot, 'Android-uni-app-x-SDK@14196-4.87/uniappxnativepackage')
}

export async function generateProject(config: AppConfig): Promise<void> {
  if (!config.projectInfo) {
    throw new Error('项目信息不存在')
  }

  const { projectInfo, packageName, signing, adDependencies: selectedAds, hbuilderxPath } = config
  const outputDir = path.resolve(process.cwd(), projectInfo.id)
  const sdkTemplatePath = getSDKTemplatePath()

  // 1. 检查 SDK 模板是否存在
  if (!await fs.pathExists(sdkTemplatePath)) {
    throw new Error(`找不到 SDK 模板: ${sdkTemplatePath}`)
  }

  // 2. 复制 SDK 模板到输出目录
  await fs.copy(sdkTemplatePath, outputDir, {
    filter: (src) => {
      // 排除 .DS_Store 和 .git 文件
      const basename = path.basename(src)
      return basename !== '.DS_Store' && basename !== '.git'
    }
  })

  // 3. 复制 www 资源
  const hbuilderxOutputPath = path.join(hbuilderxPath, 'unpackage', 'resources', 'app-android')
  const wwwSourceDir = await findWwwDir(hbuilderxOutputPath)
  if (wwwSourceDir) {
    const wwwTargetDir = path.join(outputDir, 'uniappx', 'src', 'main', 'assets', 'apps', projectInfo.id, 'www')
    await fs.ensureDir(path.dirname(wwwTargetDir))
    await fs.copy(wwwSourceDir, wwwTargetDir)
  }

  // 4. 更新 app/build.gradle
  await updateBuildGradle(outputDir, config)

  // 5. 更新 strings.xml
  await updateStringsXml(outputDir, projectInfo.name)

  // 6. 复制图标
  await copyIcons(hbuilderxOutputPath, outputDir, projectInfo.icons)

  // 7. 更新 settings.gradle 中的项目名
  await updateSettingsGradle(outputDir, projectInfo.id)
}

async function findWwwDir(basePath: string): Promise<string | null> {
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('__UNI__')) {
      const wwwDir = path.join(basePath, entry.name, 'www')
      if (await fs.pathExists(wwwDir)) {
        return wwwDir
      }
    }
  }
  return null
}

async function updateBuildGradle(outputDir: string, config: AppConfig): Promise<void> {
  const buildGradlePath = path.join(outputDir, 'app', 'build.gradle')
  let content = await fs.readFile(buildGradlePath, 'utf-8')

  const { projectInfo, packageName, signing, adDependencies: selectedAds } = config

  // 更新 applicationId
  content = content.replace(
    /applicationId\s+"[^"]+"/,
    `applicationId "${packageName}"`
  )

  // 更新 versionCode
  content = content.replace(
    /versionCode\s+\d+/,
    `versionCode ${projectInfo!.versionCode}`
  )

  // 更新 versionName
  content = content.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${projectInfo!.versionName}"`
  )

  // 添加签名配置
  if (signing.keystorePath) {
    const signingConfig = `
    signingConfigs {
        release {
            storeFile file("${signing.keystorePath}")
            storePassword "${signing.keystorePassword}"
            keyAlias "${signing.keyAlias}"
            keyPassword "${signing.keyPassword}"
        }
    }
`
    // 在 android { 后面插入签名配置
    content = content.replace(
      /(android\s*\{)/,
      `$1\n${signingConfig}`
    )

    // 在 buildTypes release 中添加签名配置引用
    content = content.replace(
      /(buildTypes\s*\{\s*release\s*\{)/,
      `$1\n            signingConfig signingConfigs.release`
    )
  }

  // 生成依赖列表
  const dependencies: string[] = [...requiredDependencies]

  // 添加模块依赖
  for (const module of projectInfo!.modules) {
    const moduleDeps = moduleDependencies[module]
    if (moduleDeps) {
      dependencies.push(...moduleDeps)
    }
  }

  // 添加广告依赖
  for (const ad of selectedAds) {
    if (ad.selected) {
      const adDeps = adDependencies[ad.id]
      if (adDeps) {
        dependencies.push(...adDeps)
      }
    }
  }

  // 去重
  const uniqueDeps = [...new Set(dependencies)]

  // 在 dependencies 块中添加依赖 (保留原有的 implementation project)
  const depsString = uniqueDeps.map(dep => `    ${dep}`).join('\n')
  content = content.replace(
    /(dependencies\s*\{)/,
    `$1\n${depsString}\n`
  )

  await fs.writeFile(buildGradlePath, content)
}

async function updateStringsXml(outputDir: string, appName: string): Promise<void> {
  const stringsXmlPath = path.join(outputDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml')
  let content = await fs.readFile(stringsXmlPath, 'utf-8')

  content = content.replace(
    /<string name="app_name">[^<]+<\/string>/,
    `<string name="app_name">${appName}</string>`
  )

  await fs.writeFile(stringsXmlPath, content)
}

async function copyIcons(sourcePath: string, outputDir: string, icons: Record<string, string>): Promise<void> {
  const iconDensityMap: Record<string, string> = {
    hdpi: 'mipmap-hdpi',
    xhdpi: 'mipmap-xhdpi',
    xxhdpi: 'mipmap-xxhdpi',
    xxxhdpi: 'mipmap-xxxhdpi',
  }

  for (const [density, iconPath] of Object.entries(icons)) {
    const targetDensity = iconDensityMap[density]
    if (targetDensity) {
      // 查找源图标
      const sourceIconPath = await findIconFile(sourcePath, iconPath)
      if (sourceIconPath) {
        const targetDir = path.join(outputDir, 'app', 'src', 'main', 'res', targetDensity)
        await fs.ensureDir(targetDir)
        await fs.copy(sourceIconPath, path.join(targetDir, 'ic_launcher.png'))
      }
    }
  }
}

async function findIconFile(basePath: string, iconPath: string): Promise<string | null> {
  // 尝试在 package 目录下查找
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('__UNI__')) {
      const fullIconPath = path.join(basePath, entry.name, iconPath)
      if (await fs.pathExists(fullIconPath)) {
        return fullIconPath
      }
    }
  }
  return null
}

async function updateSettingsGradle(outputDir: string, projectId: string): Promise<void> {
  const settingsGradlePath = path.join(outputDir, 'settings.gradle')
  let content = await fs.readFile(settingsGradlePath, 'utf-8')

  content = content.replace(
    /rootProject\.name\s*=\s*"[^"]+"/,
    `rootProject.name = "${projectId}"`
  )

  await fs.writeFile(settingsGradlePath, content)
}
