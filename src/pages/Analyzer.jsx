import { useState } from 'react'
import toast from 'react-hot-toast'
import { Activity, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { analyzePrompt } from '../utils/optimizer'
import { scanPromptSecurity } from '../utils/security'
import ScoreRing from '../components/ScoreRing'
import './Analyzer.css'

const METRIC_LABELS = [
  { key: 'clarity', label: 'Clarity' },
  { key: 'context', label: 'Context' },
  { key: 'specificity', label: 'Specificity' },
  { key: 'creativity', label: 'Creativity' },
]

export default function Analyzer() {
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [security, setSecurity] = useState(null)

  const handleAnalyze = () => {
    if (!input.trim()) {
      toast.error('Please enter a prompt to analyze')
      return
    }
    setAnalysis(analyzePrompt(input))
    setSecurity(scanPromptSecurity(input))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Prompt Analyzer</h2>
          <p>Get detailed quality metrics and a cybersecurity risk assessment for any prompt.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <label className="field-label">Prompt to Analyze</label>
        <textarea
          rows={6}
          placeholder="Paste a prompt to see its quality breakdown and security scan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={{ marginTop: 14 }}>
          <button className="btn-primary" onClick={handleAnalyze}>
            <Activity size={16} /> Analyze Prompt
          </button>
        </div>
      </div>

      {!analysis ? (
        <div className="card empty-state">
          <Activity size={32} />
          <p>Your prompt's quality metrics and security findings will appear here.</p>
        </div>
      ) : (
        <div className="analyzer-results">
          <div className="card">
            <h3 className="section-title">Quality Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-overall">
                <ScoreRing value={analysis.overall} size={110} stroke={9} />
                <span>Overall Score</span>
              </div>
              <div className="metric-list">
                {METRIC_LABELS.map((m) => (
                  <div key={m.key} className="metric-row">
                    <span className="metric-name">{m.label}</span>
                    <div className="metric-bar-track">
                      <div className="metric-bar-fill" style={{ width: `${analysis[m.key]}%` }} />
                    </div>
                    <span className="metric-score">{analysis[m.key]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="metric-meta">
              <span className="badge">{analysis.words} words</span>
              <span className="badge">~{analysis.tokens} tokens</span>
              <span className="badge accent">Effectiveness: {analysis.effectiveness}</span>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3 className="section-title"><CheckCircle2 size={16} /> Strengths</h3>
              <ul className="insight-list good">
                {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="card">
              <h3 className="section-title"><AlertTriangle size={16} /> Weaknesses</h3>
              <ul className="insight-list bad">
                {analysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title"><Lightbulb size={16} /> Suggestions</h3>
            <ul className="insight-list suggest">
              {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {security && (
            <div className="card">
              <h3 className="section-title">
                {security.riskScore > 0 ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                Cybersecurity Analysis
              </h3>
              <div className="security-summary">
                <span className={`risk-pill risk-${security.riskLevel.toLowerCase()}`}>{security.riskLevel} Risk</span>
                <span className="badge">{security.totalIssues} issue(s) found</span>
              </div>
              <ul className="insight-list suggest">
                {security.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
