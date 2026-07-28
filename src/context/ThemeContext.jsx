import { createContext, useContext, useEffect, useState } from 'react'

// Theme context - handles dark/light mode and accent color preferences
const ThemeContext = createContext(null)

const ACCENTS = {
  violet: { accent: '#7c5cff', accent2: '#22d3ee' },
  emerald: { accent: '#10b981', accent2: '#22d3ee' },
  rose: { accent: '#f43f5e', accent2: '#fb923c' },
  amber: { accent: '#f59e0b', accent2: '#f43f5e' },
  blue: { accent: '#3b82f6', accent2: '#8b5cf6' },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('poai_theme') || 'dark')
  const [accent, setAccent] = useState(() => localStorage.getItem('poai_accent') || 'violet')
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('poai_fontsize') || 'medium')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('poai_theme', theme)
  }, [theme])

  useEffect(() => {
    const palette = ACCENTS[accent] || ACCENTS.violet
    document.documentElement.style.setProperty('--accent', palette.accent)
    document.documentElement.style.setProperty('--accent-2', palette.accent2)
    localStorage.setItem('poai_accent', accent)
  }, [accent])

  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' }
    document.documentElement.style.fontSize = sizes[fontSize] || sizes.medium
    localStorage.setItem('poai_fontsize', fontSize)
  }, [fontSize])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, accent, setAccent, accents: ACCENTS, fontSize, setFontSize }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
