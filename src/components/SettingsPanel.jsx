import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { SettingsProvider, useSettings } from '../context/SettingsContext'
import { useSyncedState } from '../hooks/useSyncedState'
import { useEventListener } from '../hooks/useEventListener'
import GeneralSettings from './settings/GeneralSettings'
import NotificationSettings from './settings/NotificationSettings'
import PrivacySettings from './settings/PrivacySettings'
import SettingsPreview from './settings/SettingsPreview'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './SettingsPanel.css'

function SettingsPanelInner() {
  const { theme } = useTheme()
  const { settings, setSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('general')
  const [saveStatus, setSaveStatus] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  const autoSaveTimerRef = useRef(null)

  const [savedPrefs, setSavedPrefs] = useSyncedState('userSettings', settings)

  // Keyboard shortcut: Ctrl+S triggers save
  useEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave(settings)
    }
  })

  // Listen for cross-tab storage changes
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
    setSaveStatus('Saving...')

    // Clean up previous auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Simulate API call
    const timer = setTimeout(() => {
      setSettings((prev) => ({ ...prev, ...sectionData, saved: true }))
      setSavedPrefs((prev) => ({ ...prev, ...sectionData }))
      setSaveStatus('Saved!')
      setLastSaved(new Date().toLocaleTimeString())
    }, 1000)

    autoSaveTimerRef.current = timer
  }, [setSettings, setSavedPrefs])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  const handleQuickToggle = useCallback((key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaveStatus(`${key} updated`)
  }, [setSettings])

  const [count, setCount] = useState(0)

  const handleBatchExample = () => {
    setCount((prev) => prev + 1)
  }

  return (
    <div className={`settings-panel ${theme}`}>
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">Manage your account preferences</p>
        {saveStatus && <span className="save-status">{saveStatus}</span>}
        {lastSaved && <span className="last-saved">Last saved: {lastSaved}</span>}
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {['general', 'notifications', 'privacy'].map((tab) => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="settings-body">
          <div className="settings-main">
            {/* Each settings section is wrapped with an error boundary */}
            <ErrorBoundary>
              {activeTab === 'general' && (
                <GeneralSettings onSave={handleSave} />
              )}

              {activeTab === 'notifications' && <NotificationSettings />}

              {activeTab === 'privacy' && <PrivacySettings />}
            </ErrorBoundary>

            {/* Quick toggles */}
            <div className="settings-section">
              <h3>Quick Toggles</h3>
              <div className="setting-item">
                <label>Email Notifications</label>
                <button
                  className={`toggle-switch ${settings.emailNotifications ? 'on' : 'off'}`}
                  onClick={() => handleQuickToggle('emailNotifications')}
                >
                  {settings.emailNotifications ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="setting-item">
                <label>Auto-Save</label>
                <button
                  className={`toggle-switch ${settings.autoSave ? 'on' : 'off'}`}
                  onClick={() => handleQuickToggle('autoSave')}
                >
                  {settings.autoSave ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Save counter */}
            <div className="settings-section">
              <h3>Save Counter</h3>
              <p className="batch-info">
                Count: {count}
              </p>
              <button className="save-section-btn" onClick={handleBatchExample}>
                Increment
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

function SettingsPanel() {
  return (
    <SettingsProvider>
      <SettingsPanelInner />
    </SettingsProvider>
  )
}

export default SettingsPanel
