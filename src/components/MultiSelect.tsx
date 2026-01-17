import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { AdDependency } from '../types.js'

interface MultiSelectProps {
  label: string
  items: AdDependency[]
  onSubmit: (items: AdDependency[]) => void
  onBack?: () => void
}

export function MultiSelect({ label, items, onSubmit, onBack }: MultiSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selections, setSelections] = useState<AdDependency[]>(items)

  useInput((input, key) => {
    if (input === 'j' || key.downArrow) {
      setSelectedIndex(prev => (prev + 1) % selections.length)
    } else if (input === 'k' || key.upArrow) {
      setSelectedIndex(prev => (prev - 1 + selections.length) % selections.length)
    } else if (input === ' ') {
      setSelections(prev =>
        prev.map((item, index) =>
          index === selectedIndex ? { ...item, selected: !item.selected } : item
        )
      )
    } else if (key.return) {
      onSubmit(selections)
    } else if (input === 'b' && onBack) {
      onBack()
    }
  })

  return (
    <Box flexDirection="column">
      <Text>{label}</Text>
      <Box flexDirection="column" marginTop={1}>
        {selections.map((item, index) => (
          <Box key={item.id}>
            <Text color={index === selectedIndex ? 'green' : undefined}>
              {index === selectedIndex ? '> ' : '  '}
              [{item.selected ? 'x' : ' '}] {item.name}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
