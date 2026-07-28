import { useRef } from 'react'
import toast from 'react-hot-toast'
import { Sun, Moon, Download, Upload, Trash2, Palette, Type } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { downloadJsonFile } from '../utils/helpers'
import './Settings.css'

export default function Settings() {
  const { theme, toggleTheme, accent, setAccent, accents, fontSize, setFontSize } = useTheme()
  const { exportData, importData, resetSettings, clearAllHistory } = useApp()
  const fileInputRef = useRef(null)

  const handleExport = () => {
    downloadJsonFile('prompt-optimizer-ai-backup.json', exportData())
    toast.success('Data exported successfully')
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(reader.result)
      if (ok) toast.success('Data imported successfully')
      else toast.error('Invalid backup file')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleResetSettings = () => {
    resetSettings()
    toast.success('Settings reset. Reload the page to see defaults.')
  }

  const handleClearHistory = () => {
    clearAllHistory()
    toast.success('History cleared')
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Customize appearance and manage your local data.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <h3><Palette size={16} /> Appearance</h3>
          <div className="settings-row">
            <span>Theme</span>
            <button className="btn-secondary" onClick={toggleTheme}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />} {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
          <div className="settings-row">
            <span>Accent Color</span>
            <div className="accent-swatches">
              {Object.keys(accents).map((key) => (
                <button
                  key={key}
                  className={`accent-swatch ${accent === key ? 'active' : ''}`}
                  style={{ background: accents[key].accent }}
                  onClick={() => setAccent(key)}
                  aria-label={key}
                  title={key}
                />
              ))}
            </div>
          </div>
          <div className="settings-row">
            <span><Type size={14} /> Font Size</span>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="card settings-card">
          <h3><Download size={16} /> Data Management</h3>
          <p className="settings-desc">All your data (history, saved prompts, favorites) is stored locally in your browser. Export a backup or import a previous one.</p>
          <div className="settings-actions">
            <button className="btn-primary" onClick={handleExport}>
              <Download size={14} /> Export Backup
            </button>
            <button className="btn-secondary" onClick={handleImportClick}>
              <Upload size={14} /> Import Backup
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImportFile} />
          </div>
        </div>

        <div className="card settings-card danger-zone">
          <h3><Trash2 size={16} /> Danger Zone</h3>
          <div className="settings-row">
            <span>Clear optimization history</span>
            <button className="btn-danger" onClick={handleClearHistory}>Clear History</button>
          </div>
          <div className="settings-row">
            <span>Reset appearance settings to defaults</span>
            <button className="btn-danger" onClick={handleResetSettings}>Reset Settings</button>
          </div>
        </div>

        <div className="card settings-card">
          <h3>About</h3>
          <p className="settings-desc">
            Prompt Optimizer AI is a fully local, privacy-first prompt engineering toolkit built with React.
            No data ever leaves your browser \u2014 all processing runs client-side with rule-based optimization
            and security scanning engines.
          </p>
          <p className="settings-version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
