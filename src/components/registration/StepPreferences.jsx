import { useFormContext, useFieldArray } from 'react-hook-form'

function StepPreferences() {
  const { register, control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attendees',
  })

  return (
    <div className="form-step">
      <h2>Event Preferences</h2>

      <div className="form-field">
        <label>Event Type *</label>
        <select {...register('eventType', { required: 'Please select an event type' })}>
          <option value="">Select type...</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="meetup">Meetup</option>
          <option value="webinar">Webinar</option>
        </select>
        {errors.eventType && (
          <span className="error-text">{errors.eventType.message}</span>
        )}
      </div>

      <div className="form-field">
        <label>Dietary Requirements</label>
        <select {...register('dietary')}>
          <option value="none">None</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="halal">Halal</option>
          <option value="gluten-free">Gluten Free</option>
        </select>
      </div>

      <div className="form-field">
        <label>T-Shirt Size</label>
        <select {...register('tshirtSize')}>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
          <option value="XL">X-Large</option>
        </select>
      </div>

      {/* Dynamic attendees */}
      <div className="attendees-section">
        <div className="attendees-header">
          <label>Additional Attendees</label>
          <button
            type="button"
            className="add-attendee-btn"
            onClick={() => append({ name: '', email: '' })}
          >
            + Add Attendee
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="attendee-row">
            <input
              {...register(`attendees.${index}.name`)}
              placeholder="Attendee name"
            />
            <input
              {...register(`attendees.${index}.email`)}
              placeholder="Attendee email"
            />
            <button
              type="button"
              className="remove-attendee-btn"
              onClick={() => remove(index)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepPreferences
