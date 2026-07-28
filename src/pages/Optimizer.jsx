import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Wand2, Copy, Save, RotateCcw, ShieldAlert, ShieldCheck, Star, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { MODES } from '../data/modes'
import { PERSONAS } from '../data/personas'
import { optimizePrompt } from '../utils/optimizer'
import { scanPromptSecurity } from '../utils/security'
import { copyToClipboard } from '../utils/helpers'
import ScoreRing from '../components/ScoreRing'
import './Optimizer.css'

export default function Optimizer() {
  const { addToHistory, saveToLibrary, toggleFavoriteMode, favoriteModes, registerRecentMode, collections, addCollection } = useApp()
  const [input, setInput] = useState('')
  const [modeId, setModeId] = useState('general')
  const [personaId, setPersonaId] = useState('none')
  const [result, setResult] = useState(null)
  const [security, setSecurity] = useState(null)
  const [loading, setLoading] = useState(false)

  const sortedModes = useMemo(() => {
    const favs = MODES.filter((m) => favoriteModes.includes(m.id))
    const rest = MODES.filter((m) => !favoriteModes.includes(m.id))
    return [...favs, ...rest]
  }, [favoriteModes])

  const handleOptimize = () => {
    if (!input.trim()) {
      toast.error('Please enter a prompt to optimize')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const res = optimizePrompt(input, modeId, personaId)
      const sec = scanPromptSecurity(input)
      setResult(res)
      setSecurity(sec)
      registerRecentMode(modeId)
      addToHistory({
        original: res.original,
        optimized: res.optimized,
        mode: res.mode,
        modeId,
        persona: res.persona,
        personaId,
        before: res.before,
        after: res.after,
        improvement: res.improvement,
        security: sec,
      })
      setLoading(false)
      toast.success('Prompt optimized successfully')
    }, 400)
  }

  const handleCopy = async () => {
    if (!result) return
    const ok = await copyToClipboard(result.optimized)
    if (ok) toast.success('Copied to clipboard')
    else toast.error('Failed to copy')
  }

  const handleSave = () => {
    if (!result) return
    saveToLibrary({
      title: input.slice(0, 60),
      original: result.original,
      optimized: result.optimized,
      mode: result.mode,
      persona: result.persona,
      after: result.after,
    }, collections[0] || 'General')
    toast.success('Saved to library')
  }

  const handleReset = () => {
    setInput('')
    setResult(null)
    setSecurity(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Prompt Optimizer</h2>
          <p>Transform a rough prompt into a precise, high-quality instruction using mode and persona-specific strategies.</p>
        </div>
      </div>

      <div className="optimizer-grid">
        <div className="card optimizer-input-card">
          <label className="field-label">Your Prompt</label>
          <textarea
            rows={8}
            placeholder="e.g. write me a blog post about productivity"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="field-row">
            <div className="field-col">
              <label className="field-label">Optimization Mode</label>
              <select value={modeId} onChange={(e) => setModeId(e.target.value)}>
                {sortedModes.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="field-col">
              <label className="field-label">Persona</label>
              <select value={personaId} onChange={(e) => setPersonaId(e.target.value)}>
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mode-desc-row">
            <span>{MODES.find((m) => m.id === modeId)?.desc}</span>
            <button
              className="icon-btn fav-btn"
              onClick={() => toggleFavoriteMode(modeId)}
              aria-label="Favorite mode"
              title="Favorite this mode"
            >
              <Star size={16} fill={favoriteModes.includes(modeId) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="optimizer-actions">
            <button className="btn-primary" onClick={handleOptimize} disabled={loading}>
              <Wand2 size={16} /> {loading ? 'Optimizing...' : 'Optimize Prompt'}
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="card optimizer-result-card">
          {!result ? (
            <div className="empty-state">
              <Wand2 size={32} />
              <p>Your optimized prompt and quality scores will appear here.</p>
            </div>
          ) : (
            <>
              <div className="result-header">
                <h3>Optimized Prompt</h3>
                <div className="result-actions">
                  <button className="icon-btn" onClick={handleCopy} title="Copy"><Copy size={16} /></button>
                  <button className="icon-btn" onClick={handleSave} title="Save to library"><Save size={16} /></button>
                </div>
              </div>
              <pre className="optimized-text">{result.optimized}</pre>

              <div className="score-row">
                <div className="score-item">
                  <ScoreRing value={result.before.overall} size={64} stroke={6} />
                  <span>Before</span>
                </div>
                <ChevronDown size={20} className="score-arrow" />
                <div className="score-item">
                  <ScoreRing value={result.after.overall} size={64} stroke={6} />
                  <span>After</span>
                </div>
                <div className="improvement-badge">+{result.improvement}%</div>
              </div>

              <p className="result-summary">{result.summary}</p>

              {security && (
                <div className={`security-banner ${security.riskScore > 0 ? 'risk' : 'safe'}`}>
                  {security.riskScore > 0 ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                  <div>
                    <strong>Security Scan: {security.riskLevel} Risk</strong>
                    <ul>
                      {security.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
