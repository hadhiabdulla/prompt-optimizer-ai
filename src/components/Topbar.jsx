import { Menu, Sun, Moon, Command } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import './Topbar.css'

// Top navigation bar with sidebar toggle, theme switch, and command palette trigger
export default function Topbar({ onMenuClick, onCommandPalette, title }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="topbar glass">
      <div className="topbar-left">
        <button className="icon-btn mobile-only" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <button className="btn-secondary cmdk-btn" onClick={onCommandPalette}>
          <Command size={16} />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
