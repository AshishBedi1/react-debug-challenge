import { useState, useEffect } from 'react'
import { useSettings } from '../../context/SettingsContext'

function GeneralSettings({ onSave }) {
  const { settings } = useSettings()
  const [language, setLanguage] = useState(settings.language || 'en')
  const [autoSave, setAutoSave] = useState(settings.autoSave ?? true)
  const [preferences, setPreferences] = useState({ fontSize: 14, compact: false })

  // Sync with context when it changes
  useEffect(() => {
    setLanguage(settings.language || 'en')
    setAutoSave(settings.autoSave ?? true)
  }, [settings.language, settings.autoSave])

  const handleFontSizeChange = (size) => {
    setPreferences((prev) => ({ ...prev, fontSize: size }))
  }

  return (
    <div className="settings-section">
      <h3>General</h3>

      <div className="setting-item">
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Auto-Save</label>
        <button
          className={`toggle-switch ${autoSave ? 'on' : 'off'}`}
          onClick={() => setAutoSave(!autoSave)}
        >
          {autoSave ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>Font Size: {preferences.fontSize}px</label>
        <input
          type="range"
          min={10}
          max={24}
          value={preferences.fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
        />
      </div>

      <button className="save-section-btn" onClick={() => onSave({ language, autoSave })}>
        Save General Settings
      </button>
    </div>
  )
}

export default GeneralSettings
