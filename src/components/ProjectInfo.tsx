import React from 'react'
import { Box, Text, useInput } from 'ink'
import type { ProjectInfo } from '../types.js'

interface ProjectInfoDisplayProps {
  info: ProjectInfo
  onConfirm: () => void
  onBack?: () => void
}

export function ProjectInfoDisplay({ info, onConfirm, onBack }: ProjectInfoDisplayProps) {
  useInput((input, key) => {
    if (key.return) {
      onConfirm()
    } else if (input === 'b' && onBack) {
      onBack()
    }
  })

  const moduleList = info.modules.slice(0, 5).join(', ')
  const moreModules = info.modules.length > 5 ? ` 等 ${info.modules.length} 个模块` : ''

  return (
    <Box flexDirection="column">
      <Text bold>项目信息</Text>
      <Box flexDirection="column" marginTop={1} marginLeft={2}>
        <Box borderStyle="round" flexDirection="column" paddingX={2} paddingY={1}>
          <Text>应用名称: <Text color="green">{info.name}</Text></Text>
          <Text>应用ID: <Text color="green">{info.id}</Text></Text>
          <Text>版本: <Text color="green">{info.versionName} ({info.versionCode})</Text></Text>
          <Text>模块: <Text color="green">{moduleList}{moreModules}</Text></Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Enter 继续 | b 返回</Text>
      </Box>
    </Box>
  )
}
