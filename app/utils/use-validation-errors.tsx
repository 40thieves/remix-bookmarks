import { type Validation } from "~/utils/validation"

interface FormattedValidationErrors {
  fieldErrors?: {
    [k: string]: {
      inputProps: {
        "aria-invalid": boolean
        "aria-describedby": string
      }
      errorDisplay: JSX.Element
    }
  }
  formErrors?: JSX.Element
}

export function useValidationErrors(data?: Validation<any>) {
  if (!data || !("error" in data)) return {}

  let validationErrors: FormattedValidationErrors = {}

  if (data.error.fieldErrors) {
    validationErrors.fieldErrors = formatFieldErrors(data.error.fieldErrors)
  }

  if (data.error.formErrors) {
    validationErrors.formErrors = (
      <FormErrors formErrors={data.error.formErrors} />
    )
  }

  return validationErrors
}

function formatFieldErrors(fieldErrors: { [k: string]: string[] }) {
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

function FormErrors({ formErrors }: { formErrors: string[] }) {
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
