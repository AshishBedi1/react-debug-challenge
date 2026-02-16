import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import { useSyncedState } from '../hooks/useSyncedState'
import { useEventListener } from '../hooks/useEventListener'
import { useTranslation } from '../hooks/useTranslation'
import GeneralSettings from './settings/GeneralSettings'
import NotificationSettings from './settings/NotificationSettings'
import PrivacySettings from './settings/PrivacySettings'
import SettingsPreview from './settings/SettingsPreview'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './SettingsPanel.css'

function SettingsPanelInner() {
  const { theme } = useTheme()
  const { settings, setSettings } = useSettings()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('general')
  const [saveStatus, setSaveStatus] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  const autoSaveTimerRef = useRef(null)

  const [savedPrefs, setSavedPrefs] = useSyncedState('userSettings', settings)

  useEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave(settings)
    }
  })

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'userSettings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue))
        } catch {
          // ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [setSettings])

  const handleSave = useCallback((sectionData) => {
    setSaveStatus(t('settings_saving'))

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    const timer = setTimeout(() => {
      setSettings((prev) => ({ ...prev, ...sectionData, saved: true }))
      setSavedPrefs((prev) => ({ ...prev, ...sectionData }))
      setSaveStatus(t('settings_saved'))
      setLastSaved(new Date().toLocaleTimeString())
    }, 1000)

    autoSaveTimerRef.current = timer
  }, [setSettings, setSavedPrefs, t])

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  const handleQuickToggle = useCallback((key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaveStatus(t('settings_updated', { key }))
  }, [setSettings, t])

  const [count, setCount] = useState(0)

  const handleBatchExample = () => {
    setCount((prev) => prev + 1)
  }

  const tabKeys = ['general', 'notifications', 'privacy']
  const tabLabels = {
    general: t('settings_general'),
    notifications: t('settings_notifications'),
    privacy: t('settings_privacy'),
  }

  return (
    <div className={`settings-panel ${theme}`}>
      <div className="settings-header">
        <h1>{t('settings_title')}</h1>
        <p className="settings-subtitle">{t('settings_subtitle')}</p>
        {saveStatus && <span className="save-status">{saveStatus}</span>}
        {lastSaved && <span className="last-saved">{t('settings_lastSaved')}: {lastSaved}</span>}
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabKeys.map((tab) => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="settings-body">
          <div className="settings-main">
            <ErrorBoundary>
              {activeTab === 'general' && (
                <GeneralSettings onSave={handleSave} />
              )}

              {activeTab === 'notifications' && <NotificationSettings />}

              {activeTab === 'privacy' && <PrivacySettings />}
            </ErrorBoundary>

            <div className="settings-section">
              <h3>{t('settings_quickToggles')}</h3>
              <div className="setting-item">
                <label>{t('settings_emailNotifications')}</label>
                <button
                  className={`toggle-switch ${settings.emailNotifications ? 'on' : 'off'}`}
                  onClick={() => handleQuickToggle('emailNotifications')}
                >
                  {settings.emailNotifications ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="setting-item">
                <label>{t('settings_autoSave')}</label>
                <button
                  className={`toggle-switch ${settings.autoSave ? 'on' : 'off'}`}
                  onClick={() => handleQuickToggle('autoSave')}
                >
                  {settings.autoSave ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h3>{t('settings_saveCounter')}</h3>
              <p className="batch-info">
                {t('settings_count')}: {count}
              </p>
              <button className="save-section-btn" onClick={handleBatchExample}>
                {t('settings_increment')}
              </button>
            </div>
          </div>

          <ErrorBoundary>
            <SettingsPreview />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanelInner
