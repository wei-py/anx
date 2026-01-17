import fs from 'fs-extra'
import path from 'path'
import type { ProjectInfo } from '../types.js'

/**
 * 标准化路径，处理 Git Bash (MINGW64) 风格的路径
 * 例如: /d/workspace/driver -> D:\workspace\driver
 */
function normalizePath(inputPath: string): string {
  // 处理 Git Bash 路径格式: /d/... 或 /D/...
  const gitBashMatch = inputPath.match(/^\/([a-zA-Z])\/(.*)$/)
  if (process.platform === 'win32' && gitBashMatch) {
    const driveLetter = gitBashMatch[1].toUpperCase()
    const restPath = gitBashMatch[2].replace(/\//g, '\\')
    return `${driveLetter}:\\${restPath}`
  }
  // 返回原始路径（可能已经是正确格式）
  return path.resolve(inputPath)
}

interface ManifestJson {
  id: string
  name: string
  version: {
    name: string
    code: number
  }
  'app-android'?: {
    distribute?: {
      modules?: Record<string, unknown>
      icons?: Record<string, string>
    }
  }
}

export async function parseProject(hbuilderxPath: string): Promise<ProjectInfo> {
  // 标准化路径（处理 Git Bash 格式）
  const normalizedPath = normalizePath(hbuilderxPath)
  // 拼接产物路径
  const outputPath = path.join(normalizedPath, 'unpackage', 'resources', 'app-android')

  // 检查路径是否存在
  if (!await fs.pathExists(outputPath)) {
    throw new Error(`找不到 HBuilderX 产物目录: ${outputPath}`)
  }

  // 查找 manifest.json
  const manifestPath = await findManifest(outputPath)
  if (!manifestPath) {
    throw new Error('找不到 manifest.json 文件')
  }

  // 读取并解析 manifest.json
  const manifestContent = await fs.readFile(manifestPath, 'utf-8')
  const manifest: ManifestJson = JSON.parse(manifestContent)

  // 提取模块列表
  const modules = manifest['app-android']?.distribute?.modules
    ? Object.keys(manifest['app-android'].distribute.modules)
    : []

  // 提取图标配置
  const icons = manifest['app-android']?.distribute?.icons || {}

  return {
    id: manifest.id,
    name: manifest.name,
    versionName: manifest.version.name,
    versionCode: manifest.version.code,
    modules,
    icons,
  }
}

async function findManifest(basePath: string): Promise<string | null> {
  // 尝试直接在根目录查找
  const directPath = path.join(basePath, 'manifest.json')
  if (await fs.pathExists(directPath)) {
    return directPath
  }

  // 遍历子目录查找 (通常在 __UNI__xxx/www/manifest.json)
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('__UNI__')) {
      const wwwManifest = path.join(basePath, entry.name, 'www', 'manifest.json')
      if (await fs.pathExists(wwwManifest)) {
        return wwwManifest
      }
    }
  }

  return null
}

export function getOutputPath(hbuilderxPath: string): string {
  const normalizedPath = normalizePath(hbuilderxPath)
  return path.join(normalizedPath, 'unpackage', 'resources', 'app-android')
}
