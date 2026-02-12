import { useSettings } from '../../context/SettingsContext'

function NotificationSettings() {
  const { settings, setSettings } = useSettings()

  const handleToggleEmail = () => {
    setSettings({ emailNotifications: !settings.emailNotifications })
  }

  const handleTogglePush = () => {
    setSettings({ pushNotifications: !settings.pushNotifications })
  }

  return (
    <div className="settings-section">
      <h3>Notifications</h3>

      <div className="setting-item">
        <label>Email Notifications</label>
        <button
          className={`toggle-switch ${settings.emailNotifications ? 'on' : 'off'}`}
          onClick={handleToggleEmail}
        >
          {settings.emailNotifications ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>Push Notifications</label>
        <button
          className={`toggle-switch ${settings.pushNotifications ? 'on' : 'off'}`}
          onClick={handleTogglePush}
        >
          {settings.pushNotifications ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>Digest Frequency</label>
        <select defaultValue="daily">
          <option value="realtime">Real-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
      </div>
    </div>
  )
}

export default NotificationSettings
