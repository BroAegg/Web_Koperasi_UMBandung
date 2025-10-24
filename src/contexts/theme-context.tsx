'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeColors {
  bg: string
  topbar: string
  card: string
  border: string
  text: string
  subtext: string
  valueText: string
  kpiTitleText: string
  placeholder: string
  inputBg: string
  navHover: string
  navActive: string
  chartGrid: string
  accent: string // orange (light) / green (dark)
  highlight: string // green (light) / orange (dark)
}

interface ThemeContextType {
  darkMode: boolean
  toggleTheme: () => void
  theme: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Load theme from localStorage (must be done in initialization, not effect)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      return saved === 'dark'
    }
    return false
  })

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    // Update HTML class for compatibility (optional)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  // Theme object matching snippet.tsx exactly!
  const theme: ThemeColors = darkMode
    ? {
        bg: 'bg-slate-900 text-slate-100',
        topbar: 'bg-slate-900/85',
        card: 'bg-slate-800 border-slate-700',
        border: 'border-slate-700',
        text: 'text-slate-100',
        subtext: 'text-slate-400',
        valueText: 'text-slate-100',
        kpiTitleText: 'text-slate-300',
        placeholder: 'placeholder:text-slate-400',
        inputBg: 'bg-slate-900',
        navHover: 'hover:bg-white/5',
        navActive: 'bg-white/10 text-orange-400',
        chartGrid: '#2b3340',
        accent: '#22c55e', // green bars in dark
        highlight: '#f97316', // orange line in dark
      }
    : {
        bg: 'bg-gray-50 text-gray-900',
        topbar: 'bg-white/85',
        card: 'bg-white border-gray-200',
        border: 'border-gray-200',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        valueText: 'text-gray-900',
        kpiTitleText: 'text-gray-500',
        placeholder: 'placeholder:text-gray-400',
        inputBg: 'bg-white',
        navHover: 'hover:bg-gray-100',
        navActive: 'bg-gray-100 text-orange-500',
        chartGrid: '#eee',
        accent: '#f97316', // orange bars in light
        highlight: '#22c55e', // green line in light
      }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
