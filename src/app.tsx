import React, { useState } from 'react'
import { Box, Text } from 'ink'
import type { AppStep, AppConfig, ProjectInfo, AdDependency } from './types.js'
import { Menu } from './components/Menu.js'
import { Input } from './components/Input.js'
import { MultiSelect } from './components/MultiSelect.js'
import { ProjectInfoDisplay } from './components/ProjectInfo.js'
import { parseProject } from './services/parser.js'
import { generateProject } from './services/generator.js'

const initialAdDependencies: AdDependency[] = [
  { id: 'huawei', name: '华为广告', selected: false },
  { id: 'csj', name: '穿山甲广告', selected: false },
  { id: 'gdt', name: '优量汇广告', selected: false },
  { id: 'ks', name: '快手广告', selected: false },
  { id: 'baidu', name: '百度广告', selected: false },
  { id: 'sigmob', name: 'Sigmob广告', selected: false },
  { id: 'unity', name: 'Unity广告', selected: false },
  { id: 'vungle', name: 'Vungle广告', selected: false },
  { id: 'mintegral', name: 'Mintegral广告', selected: false },
  { id: 'ironsource', name: 'IronSource广告', selected: false },
]

const initialConfig: AppConfig = {
  hbuilderxPath: '',
  projectInfo: null,
  packageName: '',
  adDependencies: initialAdDependencies,
  signing: {
    keystorePath: 'release.keystore',
    keystorePassword: '',
    keyAlias: 'release',
    keyPassword: '',
  },
}

export function App() {
  const [step, setStep] = useState<AppStep>('menu')
  const [config, setConfig] = useState<AppConfig>(initialConfig)
  const [error, setError] = useState<string>('')
  const [signingStep, setSigningStep] = useState<number>(0)

  const handleMenuSelect = (index: number) => {
    if (index === 0) {
      // 创建新项目
      setStep('input-path')
    } else if (index === 1) {
      // 从现有项目更新 (暂时同创建新项目)
      setStep('input-path')
    } else {
      // 退出
      process.exit(0)
    }
  }

  const handlePathSubmit = async (path: string) => {
    setError('')
    try {
      const projectInfo = await parseProject(path)
      setConfig(prev => ({
        ...prev,
        hbuilderxPath: path,
        projectInfo,
        packageName: `com.example.${projectInfo.id.toLowerCase().replace(/__/g, '').replace(/_/g, '')}`,
      }))
      setStep('project-info')
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析项目失败')
    }
  }

  const handleProjectInfoConfirm = () => {
    setStep('input-package')
  }

  const handlePackageSubmit = (packageName: string) => {
    setConfig(prev => ({ ...prev, packageName }))
    setStep('select-ads')
  }

  const handleAdsSelect = (ads: AdDependency[]) => {
    setConfig(prev => ({ ...prev, adDependencies: ads }))
    setStep('input-signing')
    setSigningStep(0)
  }

  const handleSigningInput = (value: string) => {
    const fields = ['keystorePath', 'keystorePassword', 'keyAlias', 'keyPassword'] as const
    setConfig(prev => ({
      ...prev,
      signing: { ...prev.signing, [fields[signingStep]]: value },
    }))

    if (signingStep < 3) {
      setSigningStep(signingStep + 1)
    } else {
      setStep('confirm')
    }
  }

  const handleConfirm = async (index: number) => {
    if (index === 0) {
      // 确认生成
      setStep('generating')
      try {
        await generateProject(config)
        setStep('done')
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成项目失败')
        setStep('confirm')
      }
    } else if (index === 1) {
      // 返回修改
      setStep('input-path')
    } else {
      // 取消
      process.exit(0)
    }
  }

  const handleBack = () => {
    const stepOrder: AppStep[] = [
      'menu', 'input-path', 'project-info', 'input-package',
      'select-ads', 'input-signing', 'confirm'
    ]
    const currentIndex = stepOrder.indexOf(step)
    if (currentIndex > 0) {
      if (step === 'input-signing' && signingStep > 0) {
        setSigningStep(signingStep - 1)
      } else {
        setStep(stepOrder[currentIndex - 1])
      }
    }
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ┌─────────────────────────────────────────┐
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          │  ANX - uni-app-x Android 离线打包工具   │
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          └─────────────────────────────────────────┘
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red">错误: {error}</Text>
        </Box>
      )}

      {step === 'menu' && (
        <Menu
          items={['创建新项目', '从现有项目更新', '退出']}
          onSelect={handleMenuSelect}
        />
      )}

      {step === 'input-path' && (
        <Input
          label="请输入 HBuilderX 项目路径"
          placeholder="/path/to/your/uniapp-project"
          onSubmit={handlePathSubmit}
          onBack={handleBack}
        />
      )}

      {step === 'project-info' && config.projectInfo && (
        <ProjectInfoDisplay
          info={config.projectInfo}
          onConfirm={handleProjectInfoConfirm}
          onBack={handleBack}
        />
      )}

      {step === 'input-package' && (
        <Input
          label="请输入包名 (applicationId)"
          defaultValue={config.packageName}
          onSubmit={handlePackageSubmit}
          onBack={handleBack}
        />
      )}

      {step === 'select-ads' && (
        <MultiSelect
          label="选择广告依赖（空格选择，jk 上下移动，Enter 确认）"
          items={config.adDependencies}
          onSubmit={handleAdsSelect}
          onBack={handleBack}
        />
      )}

      {step === 'input-signing' && (
        <Input
          label={
            signingStep === 0 ? 'keystore 文件名（将生成到项目根目录）' :
            signingStep === 1 ? 'keystore 密码' :
            signingStep === 2 ? 'key 别名' : 'key 密码'
          }
          defaultValue={
            signingStep === 0 ? config.signing.keystorePath :
            signingStep === 1 ? config.signing.keystorePassword :
            signingStep === 2 ? config.signing.keyAlias : config.signing.keyPassword
          }
          isPassword={signingStep === 1 || signingStep === 3}
          onSubmit={handleSigningInput}
          onBack={handleBack}
        />
      )}

      {step === 'confirm' && (
        <Menu
          items={['确认生成', '返回修改', '取消']}
          onSelect={handleConfirm}
          onBack={handleBack}
        />
      )}

      {step === 'generating' && (
        <Text color="yellow">正在生成项目...</Text>
      )}

      {step === 'done' && (
        <Box flexDirection="column">
          <Text color="green">✓ 项目已生成到: ./{config.projectInfo?.id}</Text>
          <Text dimColor>按任意键退出</Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>操作: jk 上下 | 空格 多选 | Enter 确认 | b 返回</Text>
      </Box>
    </Box>
  )
}
