import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useTranslation } from '../../hooks/useTranslation'

function GeneralSettings({ onSave }) {
  const { settings, setSettings } = useSettings()
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState({ fontSize: 14, compact: false })

  const handleLanguageChange = (e) => {
    setSettings({ language: e.target.value })
  }

  const handleAutoSaveToggle = () => {
    setSettings({ autoSave: !settings.autoSave })
  }

  const handleFontSizeChange = (size) => {
    setPreferences((prev) => ({ ...prev, fontSize: size }))
  }

  return (
    <div className="settings-section">
      <h3>{t('settings_general')}</h3>

      <div className="setting-item">
        <label>{t('settings_language')}</label>
        <select value={settings.language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div className="setting-item">
        <label>{t('settings_autoSave')}</label>
        <button
          className={`toggle-switch ${settings.autoSave ? 'on' : 'off'}`}
          onClick={handleAutoSaveToggle}
        >
          {settings.autoSave ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>{t('settings_fontSize')}: {preferences.fontSize}px</label>
        <input
          type="range"
          min={10}
          max={24}
          value={preferences.fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
        />
      </div>

      <button className="save-section-btn" onClick={() => onSave({ language: settings.language, autoSave: settings.autoSave })}>
        {t('settings_saveGeneral')}
      </button>
    </div>
  )
}

export default GeneralSettings
