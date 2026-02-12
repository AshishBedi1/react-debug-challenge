import { useSettings } from '../../context/SettingsContext'

function PrivacySettings() {
  const { settings, setSettings } = useSettings()

  return (
    <div className="settings-section">
      <h3>Privacy</h3>

      <div className="setting-item">
        <label>Profile Visibility</label>
        <select
          value={settings.privacy}
          onChange={(e) => setSettings({ privacy: e.target.value })}
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Data Sharing</label>
        <button
          className="toggle-switch on"
          onClick={() => {}}
        >
          ON
        </button>
      </div>

      <div className="setting-item">
        <label>Show Activity Status</label>
        <button
          className="toggle-switch on"
          onClick={() => {}}
        >
          ON
        </button>
      </div>
    </div>
  )
}

export default PrivacySettings
