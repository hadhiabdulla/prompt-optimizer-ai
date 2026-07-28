import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wand2, Activity, LibraryBig, FolderHeart, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ScoreRing from '../components/ScoreRing'
import { formatDate, timeAgo, truncate } from '../utils/helpers'
import { MODES } from '../data/modes'
import './Dashboard.css'

export default function Dashboard() {
  const { history, saved, favoriteModes, recentModes } = useApp()

  const stats = useMemo(() => {
    const total = history.length
    const avgScore = total
      ? Math.round(history.reduce((sum, h) => sum + (h.after?.overall || 0), 0) / total)
      : 0
    const avgImprovement = total
      ? Math.round(history.reduce((sum, h) => sum + (h.improvement || 0), 0) / total)
      : 0
    const thisWeek = history.filter((h) => Date.now() - h.createdAt < 7 * 86400000).length
    return { total, avgScore, avgImprovement, thisWeek }
  }, [history])

  const recentHistory = history.slice(0, 5)
  const recentModeObjs = recentModes.map((id) => MODES.find((m) => m.id === id)).filter(Boolean).slice(0, 4)

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Welcome back</h2>
          <p>Here's a snapshot of your prompt optimization activity and quality trends.</p>
        </div>
        <Link to="/optimizer" className="btn-primary">
          <Wand2 size={16} /> New Optimization
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <span className="stat-label">Total Optimizations</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-sub"><Sparkles size={13} /> {stats.thisWeek} this week</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Avg Quality Score</span>
          <span className="stat-value">{stats.avgScore}</span>
          <span className="stat-sub"><Activity size={13} /> out of 100</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Avg Improvement</span>
          <span className="stat-value">+{stats.avgImprovement}%</span>
          <span className="stat-sub"><TrendingUp size={13} /> vs original prompt</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Saved Prompts</span>
          <span className="stat-value">{saved.length}</span>
          <span className="stat-sub"><FolderHeart size={13} /> in your library</span>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title-row">
            <h3>Recent Activity</h3>
            <Link to="/history" className="link-more">View all <ArrowRight size={14} /></Link>
          </div>
          {recentHistory.length === 0 ? (
            <div className="empty-state">
              <Wand2 size={32} />
              <p>No optimizations yet. Start by optimizing your first prompt.</p>
              <Link to="/optimizer" className="btn-secondary">Get Started</Link>
            </div>
          ) : (
            <ul className="activity-list">
              {recentHistory.map((h) => (
                <li key={h.id} className="activity-item">
                  <div className="activity-ring">
                    <ScoreRing value={h.after?.overall || 0} size={44} stroke={5} />
                  </div>
                  <div className="activity-body">
                    <p className="activity-text">{truncate(h.original, 90)}</p>
                    <span className="activity-meta">{h.mode} · {timeAgo(h.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-title-row">
            <h3>Quick Access Modes</h3>
            <Link to="/optimizer" className="link-more">All modes <ArrowRight size={14} /></Link>
          </div>
          {recentModeObjs.length === 0 ? (
            <div className="empty-state">
              <LibraryBig size={32} />
              <p>Your recently used optimization modes will appear here.</p>
            </div>
          ) : (
            <div className="mode-quick-grid">
              {recentModeObjs.map((m) => (
                <Link key={m.id} to="/optimizer" className="mode-quick-card">
                  <span className="mode-quick-label">{m.label}</span>
                  <span className="mode-quick-desc">{m.desc}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card highlight-card">
        <ShieldCheck size={28} className="highlight-icon" />
        <div>
          <h3>Built-in Prompt Security Analysis</h3>
          <p>Every prompt you optimize is automatically scanned for injection attempts, jailbreak patterns, and accidental exposure of sensitive data like API keys, passwords, or PII.</p>
        </div>
        <Link to="/analyzer" className="btn-secondary">Analyze a Prompt</Link>
      </div>
    </div>
  )
}
