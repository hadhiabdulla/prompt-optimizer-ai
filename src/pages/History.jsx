import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { History as HistoryIcon, Star, Trash2, Copy, Save, Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ScoreRing from '../components/ScoreRing'
import { formatDate, formatTime, copyToClipboard, truncate } from '../utils/helpers'
import './History.css'

export default function History() {
  const { history, deleteFromHistory, toggleHistoryFavorite, saveToLibrary, clearAllHistory, collections } = useApp()
  const [query, setQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchesQuery = !query.trim() || h.original.toLowerCase().includes(query.toLowerCase())
      const matchesFav = !onlyFavorites || h.favorite
      return matchesQuery && matchesFav
    })
  }, [history, query, onlyFavorites])

  const handleCopy = async (text) => {
    const ok = await copyToClipboard(text)
    if (ok) toast.success('Copied to clipboard')
  }

  const handleSave = (h) => {
    saveToLibrary({
      title: h.original.slice(0, 60),
      original: h.original,
      optimized: h.optimized,
      mode: h.mode,
      persona: h.persona,
      after: h.after,
    }, collections[0] || 'General')
    toast.success('Saved to library')
  }

  const handleDelete = (id) => {
    deleteFromHistory(id)
    toast.success('Removed from history')
  }

  const handleClearAll = () => {
    if (history.length === 0) return
    if (window.confirm('Clear all optimization history? This cannot be undone.')) {
      clearAllHistory()
      toast.success('History cleared')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>History</h2>
          <p>Review every prompt you've optimized, revisit results, and manage your activity log.</p>
        </div>
        <button className="btn-secondary" onClick={handleClearAll}>
          <Trash2 size={15} /> Clear All
        </button>
      </div>

      <div className="templates-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search history..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className={`btn-secondary ${onlyFavorites ? 'active-filter' : ''}`}
          onClick={() => setOnlyFavorites((v) => !v)}
        >
          <Star size={15} fill={onlyFavorites ? 'currentColor' : 'none'} /> Favorites
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <HistoryIcon size={32} />
          <p>No history entries found.</p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((h) => (
            <div key={h.id} className="card history-item">
              <div className="history-row" onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}>
                <ScoreRing value={h.after?.overall || 0} size={48} stroke={5} />
                <div className="history-body">
                  <p className="history-text">{truncate(h.original, 110)}</p>
                  <span className="history-meta">{h.mode} · {formatDate(h.createdAt)} {formatTime(h.createdAt)}</span>
                </div>
                <div className="history-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="icon-btn" onClick={() => toggleHistoryFavorite(h.id)} title="Favorite">
                    <Star size={15} fill={h.favorite ? 'currentColor' : 'none'} style={{ color: h.favorite ? '#f59e0b' : undefined }} />
                  </button>
                  <button className="icon-btn" onClick={() => handleCopy(h.optimized)} title="Copy"><Copy size={15} /></button>
                  <button className="icon-btn" onClick={() => handleSave(h)} title="Save to library"><Save size={15} /></button>
                  <button className="icon-btn danger" onClick={() => handleDelete(h.id)} title="Delete"><X size={15} /></button>
                </div>
              </div>
              {expandedId === h.id && (
                <div className="history-expanded">
                  <div>
                    <span className="field-label">Original</span>
                    <p className="expanded-text">{h.original}</p>
                  </div>
                  <div>
                    <span className="field-label">Optimized</span>
                    <pre className="optimized-text">{h.optimized}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
