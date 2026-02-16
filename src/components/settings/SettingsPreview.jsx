import { useSettings } from '../../context/SettingsContext'
import { useTranslation } from '../../hooks/useTranslation'

const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
}

function SettingsPreview() {
  const { settings } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-preview">
      <h3>{t('settings_preview')}</h3>
      <div className="preview-grid">
        <div className="preview-item">
          <span className="preview-label">{t('settings_language')}</span>
          <span className="preview-value">{languageNames[settings.language] || settings.language}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">{t('settings_emailNotifications')}</span>
          <span className="preview-value">{settings.emailNotifications ? 'On' : 'Off'}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">{t('settings_pushNotifications')}</span>
          <span className="preview-value">{settings.pushNotifications ? 'On' : 'Off'}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">{t('settings_privacy')}</span>
          <span className="preview-value">{settings.privacy}</span>
        </div>
        <div className="preview-item">
          <span className="preview-label">{t('settings_autoSave')}</span>
          <span className="preview-value">{settings.autoSave ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  )
}

export default SettingsPreview
