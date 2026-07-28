import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, Copy, Wand2, LibraryBig } from 'lucide-react'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates'
import { copyToClipboard } from '../utils/helpers'
import './Templates.css'

export default function Templates() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category
      const matchesQuery =
        !query.trim() ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.body.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const handleCopy = async (body) => {
    const ok = await copyToClipboard(body)
    if (ok) toast.success('Template copied to clipboard')
    else toast.error('Failed to copy')
  }

  const handleUse = (body) => {
    sessionStorage.setItem('poai_template_draft', body)
    navigate('/optimizer')
    toast.success('Template loaded. Paste into the optimizer.')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Prompt Templates</h2>
          <p>Browse a curated library of starter prompts across categories. Copy or send straight to the optimizer.</p>
        </div>
      </div>

      <div className="templates-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
          <option value="All">All Categories</option>
          {TEMPLATE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <LibraryBig size={32} />
          <p>No templates match your search. Try a different keyword or category.</p>
        </div>
      ) : (
        <div className="templates-grid">
          {filtered.map((t) => (
            <div key={t.id} className="card template-card">
              <span className="badge accent">{t.category}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <div className="template-actions">
                <button className="icon-btn" onClick={() => handleCopy(t.body)} title="Copy">
                  <Copy size={15} />
                </button>
                <button className="btn-secondary" onClick={() => handleUse(t.body)}>
                  <Wand2 size={14} /> Use in Optimizer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
