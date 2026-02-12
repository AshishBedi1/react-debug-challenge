import { useFormContext } from 'react-hook-form'

function StepPersonal() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="form-step">
      <h2>Personal Information</h2>

      <div className="form-field">
        <label>Full Name *</label>
        <input
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
          placeholder="Enter your full name"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name.message}</span>}
      </div>

      <div className="form-field">
        <label>Email *</label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          placeholder="your@email.com"
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label>Phone</label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="(optional)"
        />
      </div>
    </div>
  )
}

export default StepPersonal
