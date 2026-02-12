import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTheme } from '../context/ThemeContext'
import StepPersonal from './registration/StepPersonal'
import StepPreferences from './registration/StepPreferences'
import StepPayment from './registration/StepPayment'
import StepConfirmation from './registration/StepConfirmation'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './EventRegistration.css'

const steps = ['Personal', 'Preferences', 'Payment', 'Confirm']

function EventRegistration() {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: '',
      dietary: 'none',
      tshirtSize: 'M',
      attendees: [],
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      billingAddress: '',
    },
    mode: 'onBlur',
  })

  const { handleSubmit, reset, formState: { isValid } } = methods

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error('Submission failed')

      console.log('Submitted:', data)
      setSubmitStatus('success')
      toast.success('Registration submitted!')
      reset()
      setCurrentStep(0)
    } catch (err) {
      setSubmitStatus('error')
      toast.error('Registration failed: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className={`event-registration ${theme}`}>
      <div className="reg-header">
        <h1>Event Registration</h1>
        <p className="reg-subtitle">Register for our upcoming event</p>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step-dot ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-label">{step}</span>
          </div>
        ))}
      </div>

      <ErrorBoundary>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="reg-form">
            {currentStep === 0 && <StepPersonal />}
            {currentStep === 1 && <StepPreferences />}
            {currentStep === 2 && <StepPayment />}
            {currentStep === 3 && <StepConfirmation />}

            <div className="form-navigation">
              {currentStep > 0 && (
                <button type="button" className="nav-btn back-btn" onClick={handleBack}>
                  Back
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button type="button" className="nav-btn next-btn" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="nav-btn submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </ErrorBoundary>

      {submitStatus === 'success' && (
        <div className="submit-success">
          Registration submitted successfully!
        </div>
      )}
    </div>
  )
}

export default EventRegistration
