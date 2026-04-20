'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'sanguine' | 'noir' | 'swiss'
type Mode = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  mode: Mode
  setTheme: (t: Theme) => void
  setMode: (m: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('sanguine')
  const [mode, setModeState] = useState<Mode>('light')

  /* Sync avec ce que le ThemeScript a déjà appliqué sur <html> */
  useEffect(() => {
    const savedTheme = (localStorage.getItem('ef-theme') as Theme) || 'sanguine'
    const savedMode = (localStorage.getItem('ef-mode') as Mode) || 'light'
    setThemeState(savedTheme)
    setModeState(savedMode)
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem('ef-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const setMode = useCallback((m: Mode) => {
    setModeState(m)
    localStorage.setItem('ef-mode', m)
    document.documentElement.setAttribute('data-mode', m)
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }, [mode, setMode])

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
