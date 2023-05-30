import { type Validation } from "~/utils/validation"
import { ValidationError } from "./errors"

export function useValidationErrors(data?: Validation<any>) {
  if (!data || !("error" in data)) return {}

  return {
    fieldErrors: formatFieldErrors(data.error.fieldErrors),
    formErrors: <FormErrors formErrors={data.error.formErrors} />,
    announcement: <Announcement errors={data.error} />
  }
}

function formatFieldErrors(fieldErrors: { [k: string]: string[] } = {}) {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([name, errors]) => {
      return [
        name,
        {
          inputProps: {
            "aria-invalid": true,
            "aria-describedby": `${name}-error`
          },
          errorDisplay: (
            <div role="alert" id={`${name}-error`}>
              {errors.map((error) => (
                <p key={`${name}-error-${error}`}>{error}</p>
              ))}
            </div>
          )
        }
      ]
    })
  )
}

function FormErrors({ formErrors }: { formErrors?: string[] }) {
  if (!formErrors) return null

  return (
    <div role="alert">
      <ul>
        {formErrors.map((error) => {
          return <li key={error}>{error}</li>
        })}
      </ul>
    </div>
  )
}

function Announcement({ errors }: { errors: ValidationError }) {
  return (
    <div aria-live="assertive" className="sr-only">
      {errors.fieldErrors || errors.formErrors ? "Form is invalid" : null}
    </div>
  )
}
