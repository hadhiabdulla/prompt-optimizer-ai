import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CommandPalette from './components/CommandPalette'
import Dashboard from './pages/Dashboard'
import Optimizer from './pages/Optimizer'
import Analyzer from './pages/Analyzer'
import Templates from './pages/Templates'
import HistoryPage from './pages/History'
import SavedLibrary from './pages/SavedLibrary'
import Comparison from './pages/Comparison'
import AIChat from './pages/AIChat'
import SettingsPage from './pages/Settings'
import './App.css'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/optimizer': 'Prompt Optimizer',
  '/analyzer': 'Prompt Analyzer',
  '/templates': 'Templates',
  '/history': 'History',
  '/library': 'Saved Library',
  '/compare': 'Comparison',
  '/chat': 'AI Assistant',
  '/settings': 'Settings',
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((p) => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const title = TITLES[location.pathname] || 'Prompt Optimizer AI'

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onCommandPalette={() => setPaletteOpen(true)}
          title={title}
        />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/library" element={<SavedLibrary />} />
            <Route path="/compare" element={<Comparison />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
    </div>
  )
}
