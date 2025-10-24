'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
