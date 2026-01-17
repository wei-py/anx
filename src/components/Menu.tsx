import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

interface MenuProps {
  items: string[]
  onSelect: (index: number) => void
  onBack?: () => void
}

export function Menu({ items, onSelect, onBack }: MenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useInput((input, key) => {
    if (input === 'j' || key.downArrow) {
      setSelectedIndex(prev => (prev + 1) % items.length)
    } else if (input === 'k' || key.upArrow) {
      setSelectedIndex(prev => (prev - 1 + items.length) % items.length)
    } else if (key.return) {
      onSelect(selectedIndex)
    } else if (input === 'b' && onBack) {
      onBack()
    }
  })

  return (
    <Box flexDirection="column">
      {items.map((item, index) => (
        <Box key={index}>
          <Text color={index === selectedIndex ? 'green' : undefined}>
            {index === selectedIndex ? '> ' : '  '}
            {item}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
