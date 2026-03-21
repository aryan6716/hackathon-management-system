import React, { createContext, useContext, useState, useEffect } from 'react'

const THEMES = ['dark', 'darker', 'oled']
const STORAGE_KEY = 'hackathonhub-theme'

// Detect system preference
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'
}

// Read saved or system preference
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && THEMES.includes(saved)) return saved
  return getSystemTheme()
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply theme class to <html> element on change
  useEffect(() => {
    const root = document.documentElement
    // Remove all theme classes first
    THEMES.forEach(t => root.classList.remove(`theme-${t}`))
    root.classList.add(`theme-${theme}`)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (t) => {
    if (THEMES.includes(t)) setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
