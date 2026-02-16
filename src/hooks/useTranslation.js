import { useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import translations from '../i18n/translations'

export function useTranslation() {
  const { settings } = useSettings()
  const lang = settings.language || 'en'
  const strings = translations[lang] || translations.en

  const t = useCallback(
    (key, params) => {
      let text = strings[key] ?? translations.en[key] ?? key
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
        })
      }
      return text
    },
    [strings]
  )

  return { t, language: lang }
}
