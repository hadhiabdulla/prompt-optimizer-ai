import { NavLink } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Wand2, Activity, LibraryBig, History, FolderHeart,
  GitCompare, MessagesSquare, Settings, X,
} from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/optimizer', label: 'Optimizer', icon: Wand2 },
  { to: '/analyzer', label: 'Analyzer', icon: Activity },
  { to: '/templates', label: 'Templates', icon: LibraryBig },
  { to: '/history', label: 'History', icon: History },
  { to: '/library', label: 'Saved Library', icon: FolderHeart },
  { to: '/compare', label: 'Comparison', icon: GitCompare },
  { to: '/chat', label: 'AI Assistant', icon: MessagesSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

// Responsive sidebar navigation
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar glass ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <Sparkles size={22} className="brand-icon" />
            <span className="gradient-text brand-text">Prompt Optimizer AI</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>B.Tech Cybersecurity Mini Project</p>
        </div>
      </aside>
    </>
  )
}
