import { useFormContext } from 'react-hook-form'

/**
 * Step 4: Review and confirm.
 */
function StepConfirmation() {
  const { watch } = useFormContext()
  const formData = watch()

  return (
    <div className="form-step">
      <h2>Review & Confirm</h2>

      <div className="confirmation-summary">
        <div className="confirm-section">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
          <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
        </div>

        <div className="confirm-section">
          <h3>Event Preferences</h3>
          <p><strong>Event Type:</strong> {formData.eventType || 'Not selected'}</p>
          <p><strong>Dietary:</strong> {formData.dietary || 'None'}</p>
          <p><strong>T-Shirt:</strong> {formData.tshirtSize || 'Not selected'}</p>
          {formData.attendees?.length > 0 && (
            <div>
              <strong>Additional Attendees:</strong>
              <ul>
                {formData.attendees.map((a, i) => (
                  <li key={i}>{a.name} ({a.email})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="confirm-section">
          <h3>Payment</h3>
          <p><strong>Card:</strong> {formData.cardNumber ? `**** ${formData.cardNumber.slice(-4)}` : 'Not provided'}</p>
          <p><strong>Expiry:</strong> {formData.cardExpiry || 'Not provided'}</p>
        </div>
      </div>

      <p className="confirm-note">
        Please review your information above. Click "Submit Registration" to complete.
      </p>
    </div>
  )
}

export default StepConfirmation
