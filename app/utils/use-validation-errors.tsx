import { Validation } from "~/utils/validation"

export function useValidationErrors(data?: Validation<any>) {
  if (!data || !("error" in data) || !data.error.fieldErrors) return {}

  return Object.fromEntries(
    Object.entries(data.error.fieldErrors).map(([name, errors]) => {
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
