import { useState } from 'react'
import toast from 'react-hot-toast'
import { GitCompare, ArrowRight } from 'lucide-react'
import { optimizePrompt, analyzePrompt } from '../utils/optimizer'
import { MODES } from '../data/modes'
import ScoreRing from '../components/ScoreRing'
import './Comparison.css'

export default function Comparison() {
  const [promptA, setPromptA] = useState('')
  const [promptB, setPromptB] = useState('')
  const [modeA, setModeA] = useState('general')
  const [modeB, setModeB] = useState('general')
  const [resultA, setResultA] = useState(null)
  const [resultB, setResultB] = useState(null)

  const handleCompare = () => {
    if (!promptA.trim() || !promptB.trim()) {
      toast.error('Enter both prompts to compare')
      return
    }
    const a = optimizePrompt(promptA, modeA)
    const b = optimizePrompt(promptB, modeB)
    setResultA(a)
    setResultB(b)
    toast.success('Comparison complete')
  }

  const winner = resultA && resultB
    ? resultA.after.overall === resultB.after.overall
      ? 'tie'
      : resultA.after.overall > resultB.after.overall ? 'A' : 'B'
    : null

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Prompt Comparison</h2>
          <p>Compare two prompts side-by-side across quality metrics to pick the stronger one.</p>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="card comparison-input-card">
          <label className="field-label">Prompt A</label>
          <textarea rows={6} value={promptA} onChange={(e) => setPromptA(e.target.value)} placeholder="Enter first prompt..." />
          <label className="field-label">Mode</label>
          <select value={modeA} onChange={(e) => setModeA(e.target.value)}>
            {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div className="card comparison-input-card">
          <label className="field-label">Prompt B</label>
          <textarea rows={6} value={promptB} onChange={(e) => setPromptB(e.target.value)} placeholder="Enter second prompt..." />
          <label className="field-label">Mode</label>
          <select value={modeB} onChange={(e) => setModeB(e.target.value)}>
            {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="comparison-actions">
        <button className="btn-primary" onClick={handleCompare}>
          <GitCompare size={16} /> Compare Prompts
        </button>
      </div>

      {resultA && resultB && (
        <div className="comparison-results">
          <div className={`result-card ${winner === 'A' ? 'winner' : ''}`}>
            <h3>Prompt A {winner === 'A' && <span className="winner-badge">Winner</span>}</h3>
            <ScoreRing value={resultA.after.overall} size={72} stroke={6} />
            <div className="metric-rows">
              <div className="metric-row"><span>Clarity</span><span>{resultA.after.clarity}</span></div>
              <div className="metric-row"><span>Context</span><span>{resultA.after.context}</span></div>
              <div className="metric-row"><span>Specificity</span><span>{resultA.after.specificity}</span></div>
              <div className="metric-row"><span>Creativity</span><span>{resultA.after.creativity}</span></div>
            </div>
            <pre className="optimized-preview">{resultA.optimized}</pre>
          </div>
          <div className="vs-divider"><ArrowRight size={24} /></div>
          <div className={`result-card ${winner === 'B' ? 'winner' : ''}`}>
            <h3>Prompt B {winner === 'B' && <span className="winner-badge">Winner</span>}</h3>
            <ScoreRing value={resultB.after.overall} size={72} stroke={6} />
            <div className="metric-rows">
              <div className="metric-row"><span>Clarity</span><span>{resultB.after.clarity}</span></div>
              <div className="metric-row"><span>Context</span><span>{resultB.after.context}</span></div>
              <div className="metric-row"><span>Specificity</span><span>{resultB.after.specificity}</span></div>
              <div className="metric-row"><span>Creativity</span><span>{resultB.after.creativity}</span></div>
            </div>
            <pre className="optimized-preview">{resultB.optimized}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
