import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Wand2, Activity, LibraryBig, History, FolderHeart,
  GitCompare, MessagesSquare, Settings, Search,
} from 'lucide-react'
import './CommandPalette.css'

const ACTIONS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'optimizer', label: 'Go to Optimizer', icon: Wand2, path: '/optimizer' },
  { id: 'analyzer', label: 'Go to Analyzer', icon: Activity, path: '/analyzer' },
  { id: 'templates', label: 'Go to Templates', icon: LibraryBig, path: '/templates' },
  { id: 'history', label: 'Go to History', icon: History, path: '/history' },
  { id: 'library', label: 'Go to Saved Library', icon: FolderHeart, path: '/library' },
  { id: 'compare', label: 'Go to Comparison', icon: GitCompare, path: '/compare' },
  { id: 'chat', label: 'Go to AI Assistant', icon: MessagesSquare, path: '/chat' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, path: '/settings' },
]

// Global command palette (Ctrl+K) for quick navigation
export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filtered = useMemo(
    () => ACTIONS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  if (!open) return null

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel glass" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-wrap">
          <Search size={18} />
          <input
            autoFocus
            placeholder="Search pages and actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <p className="cmdk-empty">No results found.</p>}
          {filtered.map(({ id, label, icon: Icon, path }) => (
            <button key={id} className="cmdk-item" onClick={() => go(path)}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
