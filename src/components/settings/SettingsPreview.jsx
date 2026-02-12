import { useSettings } from '../../context/SettingsContext'

function SettingsPreview() {
  const { settings } = useSettings()

  return (
    <div className="settings-preview">
      <h3>Current Settings Preview</h3>
      <div className="preview-grid">
        <div className="preview-item">
          <span className="preview-label">Language</span>
          <span className="preview-value">{settings.language}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">Email Notifications</span>
          <span className="preview-value">{settings.emailNotifications ? 'On' : 'Off'}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">Push Notifications</span>
          <span className="preview-value">{settings.pushNotifications ? 'On' : 'Off'}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">Privacy</span>
          <span className="preview-value">{settings.privacy}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">Auto-Save</span>
          <span className="preview-value">{settings.autoSave ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  )
}

export default SettingsPreview
