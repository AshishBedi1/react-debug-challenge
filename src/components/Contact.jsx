import { useState } from 'react'
import { toast } from 'react-toastify'
import './Contact.css'

const initialForm = { name: '', email: '', subject: '', message: '' }

function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email'
    }
    if (!form.message.trim()) next.message = 'Message is required'
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
    toast.success('Message sent! We\'ll get back to you soon.', {
      position: 'top-right',
      autoClose: 3000,
    })
    setForm(initialForm)
    setErrors({})
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>📬 Contact Us</h1>
          <p>Have a question? Send us a message and we'll respond as soon as we can.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-group">
            <label htmlFor="contact-name">Name *</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
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
            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
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
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is this about?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your message..."
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
              Send Message
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={() => {
                setForm(initialForm)
                setErrors({})
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
