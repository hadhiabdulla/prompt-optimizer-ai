import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { FolderHeart, Star, Trash2, Copy, Search, Plus, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { copyToClipboard, downloadJsonFile, formatDate } from '../utils/helpers'
import './SavedLibrary.css'

export default function SavedLibrary() {
  const { saved, deleteFromLibrary, toggleLibraryFavorite, collections, addCollection } = useApp()
  const [query, setQuery] = useState('')
  const [activeCollection, setActiveCollection] = useState('All')
  const [newCollection, setNewCollection] = useState('')

  const filtered = useMemo(() => {
    return saved.filter((s) => {
      const matchesCollection = activeCollection === 'All' || s.collection === activeCollection
      const matchesQuery = !query.trim() || s.title?.toLowerCase().includes(query.toLowerCase())
      return matchesCollection && matchesQuery
    })
  }, [saved, query, activeCollection])

  const handleCopy = async (text) => {
    const ok = await copyToClipboard(text)
    if (ok) toast.success('Copied to clipboard')
  }

  const handleAddCollection = () => {
    if (!newCollection.trim()) return
    addCollection(newCollection.trim())
    setNewCollection('')
    toast.success('Collection added')
  }

  const handleExport = () => {
    downloadJsonFile('prompt-optimizer-library.json', saved)
    toast.success('Library exported')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Saved Library</h2>
          <p>Your curated collection of saved, high-quality prompts organized by category.</p>
        </div>
        <button className="btn-secondary" onClick={handleExport}>
          <Download size={15} /> Export Library
        </button>
      </div>

      <div className="library-layout">
        <aside className="card collections-panel">
          <h3 className="section-title">Collections</h3>
          <ul className="collection-list">
            <li>
              <button
                className={activeCollection === 'All' ? 'active' : ''}
                onClick={() => setActiveCollection('All')}
              >
                All Prompts <span>{saved.length}</span>
              </button>
            </li>
            {collections.map((c) => (
              <li key={c}>
                <button
                  className={activeCollection === c ? 'active' : ''}
                  onClick={() => setActiveCollection(c)}
                >
                  {c} <span>{saved.filter((s) => s.collection === c).length}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="new-collection-row">
            <input
              type="text"
              placeholder="New collection"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
            />
            <button className="icon-btn" onClick={handleAddCollection} title="Add collection"><Plus size={15} /></button>
          </div>
        </aside>

        <div className="library-main">
          <div className="search-box" style={{ marginBottom: 16 }}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search saved prompts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="card empty-state">
              <FolderHeart size={32} />
              <p>No saved prompts in this collection yet.</p>
            </div>
          ) : (
            <div className="templates-grid">
              {filtered.map((s) => (
                <div key={s.id} className="card template-card">
                  <div className="saved-card-top">
                    <span className="badge accent">{s.collection}</span>
                    <button className="icon-btn" onClick={() => toggleLibraryFavorite(s.id)} title="Favorite">
                      <Star size={14} fill={s.favorite ? 'currentColor' : 'none'} style={{ color: s.favorite ? '#f59e0b' : undefined }} />
                    </button>
                  </div>
                  <h3>{s.title || 'Untitled Prompt'}</h3>
                  <p>{s.optimized}</p>
                  <span className="history-meta">{formatDate(s.createdAt)}</span>
                  <div className="template-actions">
                    <button className="icon-btn" onClick={() => handleCopy(s.optimized)} title="Copy"><Copy size={15} /></button>
                    <button className="icon-btn danger" onClick={() => deleteFromLibrary(s.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
