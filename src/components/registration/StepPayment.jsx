import { useFormContext } from 'react-hook-form'

function StepPayment() {
  const { register, setValue, trigger, formState: { errors } } = useFormContext()

  const handleAutoFill = () => {
    setValue('cardNumber', '4242 4242 4242 4242', { shouldValidate: true, shouldDirty: true })
    setValue('cardExpiry', '12/28', { shouldValidate: true, shouldDirty: true })
    setValue('cardCvc', '123', { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className="form-step">
      <h2>Payment Details</h2>

      <button type="button" className="autofill-btn" onClick={handleAutoFill}>
        Auto-fill Test Card
      </button>

      <div className="form-field">
        <label>Card Number *</label>
        <input
          {...register('cardNumber', {
            required: 'Card number is required',
            pattern: {
              value: /^[\d\s]{16,19}$/,
              message: 'Invalid card number',
            },
          })}
          placeholder="1234 5678 9012 3456"
          className={errors.cardNumber ? 'input-error' : ''}
          onBlur={() => trigger('cardNumber')}
        />
        {errors.cardNumber && (
          <span className="error-text">{errors.cardNumber.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Expiry *</label>
          <input
            {...register('cardExpiry', {
              required: 'Expiry required',
            })}
            placeholder="MM/YY"
            className={errors.cardExpiry ? 'input-error' : ''}
            onBlur={() => trigger('cardExpiry')}
          />
          {errors.cardExpiry && (
            <span className="error-text">{errors.cardExpiry.message}</span>
          )}
        </div>

        <div className="form-field">
          <label>CVC *</label>
          <input
            {...register('cardCvc', {
              required: 'CVC required',
            })}
            placeholder="123"
            className={errors.cardCvc ? 'input-error' : ''}
            onBlur={() => trigger('cardCvc')}
          />
          {errors.cardCvc && (
            <span className="error-text">{errors.cardCvc.message}</span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label>Billing Address</label>
        <input
          {...register('billingAddress')}
          placeholder="123 Main St"
        />
      </div>
    </div>
  )
}

export default StepPayment
