import { useState } from 'react'
import { toast } from 'react-toastify'
import { useLocale } from '../context/LocaleContext'
import { usePreferences } from '../context/PreferencesContext'
import { useTranslation } from '../hooks/useTranslation'
import './Contact.css'

function Contact() {
  const { locale } = useLocale()
  const { currency } = usePreferences()
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [phone, setPhone] = useState('')

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t('contact_nameRequired')
    if (!form.email.trim()) next.email = t('contact_emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = t('contact_emailInvalid')
    }
    if (!form.message.trim()) next.message = t('contact_messageRequired')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    toast.success(`${t('contact_success')}${phone ? ` Phone: ${phone}` : ''}`, {
      position: 'top-right',
      autoClose: 3000,
    })
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setPhone('')
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>📬 {t('contact_title')}</h1>
          <p>{t('contact_subtitle')} (Locale: {locale}) · Display: {currency}</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-group">
            <label htmlFor="contact-name">{t('contact_name')} *</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('contact_namePlaceholder')}
              className={errors.name ? 'input-error' : ''}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span id="name-error" className="form-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">{t('contact_email')} *</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('contact_emailPlaceholder')}
              className={errors.email ? 'input-error' : ''}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">{t('contact_subject')}</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={t('contact_subjectPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-phone">{t('contact_phone')}</label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('contact_phonePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">{t('contact_message')} *</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t('contact_messagePlaceholder')}
              rows={5}
              className={errors.message ? 'input-error' : ''}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <span id="message-error" className="form-error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {t('contact_send')}
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={() => {
                setForm({ name: '', email: '', subject: '', message: '' })
                setErrors({})
                setPhone('')
              }}
            >
              {t('contact_reset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
