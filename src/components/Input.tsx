import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'

interface InputProps {
  label: string
  placeholder?: string
  defaultValue?: string
  isPassword?: boolean
  onSubmit: (value: string) => void
  onBack?: () => void
}

export function Input({
  label,
  placeholder = '',
  defaultValue = '',
  isPassword = false,
  onSubmit,
  onBack
}: InputProps) {
  const [value, setValue] = useState(defaultValue)
  const [cursorPosition, setCursorPosition] = useState(defaultValue.length)

  // 当 defaultValue 变化时同步更新
  useEffect(() => {
    setValue(defaultValue)
    setCursorPosition(defaultValue.length)
  }, [defaultValue])

  useInput((input, key) => {
    if (key.return) {
      onSubmit(value)
    } else if (input === 'b' && key.ctrl && onBack) {
      onBack()
    } else if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        setValue(prev => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition))
        setCursorPosition(prev => prev - 1)
      }
    } else if (key.leftArrow) {
      setCursorPosition(prev => Math.max(0, prev - 1))
    } else if (key.rightArrow) {
      setCursorPosition(prev => Math.min(value.length, prev + 1))
    } else if (!key.ctrl && !key.meta && input) {
      setValue(prev => prev.slice(0, cursorPosition) + input + prev.slice(cursorPosition))
      setCursorPosition(prev => prev + input.length)
    }
  })

  const displayValue = isPassword ? '*'.repeat(value.length) : value
  const displayWithCursor = displayValue.slice(0, cursorPosition) + '█' + displayValue.slice(cursorPosition)

  return (
    <Box flexDirection="column">
      <Text>{label}</Text>
      <Box>
        <Text color="green">&gt; </Text>
        <Text>
          {value ? displayWithCursor : <Text dimColor>{placeholder}█</Text>}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Enter 确认 | Ctrl+B 返回</Text>
      </Box>
    </Box>
  )
}
