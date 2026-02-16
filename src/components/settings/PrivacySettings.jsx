import { useSettings } from '../../context/SettingsContext'
import { useTranslation } from '../../hooks/useTranslation'

function PrivacySettings() {
  const { settings, setSettings } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-section">
      <h3>{t('settings_privacy')}</h3>

      <div className="setting-item">
        <label>{t('settings_profileVisibility')}</label>
        <select
          value={settings.privacy}
          onChange={(e) => setSettings({ privacy: e.target.value })}
        >
          <option value="public">{t('settings_public')}</option>
          <option value="friends">{t('settings_friendsOnly')}</option>
          <option value="private">{t('settings_private')}</option>
        </select>
      </div>

      <div className="setting-item">
        <label>{t('settings_dataSharing')}</label>
        <button
          className="toggle-switch on"
          onClick={() => {}}
        >
          ON
        </button>
      </div>

      <div className="setting-item">
        <label>{t('settings_activityStatus')}</label>
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
