import { useSettings } from '../../context/SettingsContext'
import { useTranslation } from '../../hooks/useTranslation'

function NotificationSettings() {
  const { settings, setSettings } = useSettings()
  const { t } = useTranslation()

  const handleToggleEmail = () => {
    setSettings({ emailNotifications: !settings.emailNotifications })
  }

  const handleTogglePush = () => {
    setSettings({ pushNotifications: !settings.pushNotifications })
  }

  return (
    <div className="settings-section">
      <h3>{t('settings_notifications')}</h3>

      <div className="setting-item">
        <label>{t('settings_emailNotifications')}</label>
        <button
          className={`toggle-switch ${settings.emailNotifications ? 'on' : 'off'}`}
          onClick={handleToggleEmail}
        >
          {settings.emailNotifications ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>{t('settings_pushNotifications')}</label>
        <button
          className={`toggle-switch ${settings.pushNotifications ? 'on' : 'off'}`}
          onClick={handleTogglePush}
        >
          {settings.pushNotifications ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="setting-item">
        <label>{t('settings_digestFrequency')}</label>
        <select defaultValue="daily">
          <option value="realtime">{t('settings_realtime')}</option>
          <option value="daily">{t('settings_daily')}</option>
          <option value="weekly">{t('settings_weekly')}</option>
          <option value="never">{t('settings_never')}</option>
        </select>
      </div>
    </div>
  )
}

export default NotificationSettings
