import { isRouteErrorResponse } from "@remix-run/react"
import { type ErrorResponse } from "@remix-run/router"

export interface ErrorDetails {
  code: string
  message: string
}

interface DetailedError extends ErrorResponse {
  data: {
    // The validate() method auto-wraps invalid responses with an error key, so
    // we wrap all errors in a similar way for consistency
    error: ErrorDetails
  }
}

export interface ValidationError {
  formErrors?: string[]
  fieldErrors?: {
    [k: string]: string[]
  }
}

function hasErrorDetail(error: ErrorResponse): error is DetailedError {
  if (!error.data.error) return false
  return "code" in error.data?.error
}

export function getStatusText(error: ErrorResponse) {
  switch (error.status) {
    case 400:
      return "Bad Request"

    case 401:
      return "Unauthorized"

    case 404:
      return "Not Found"

    default:
      return "Unknown Status"
  }
}

const DEFAULT_MESSAGE = "Something went wrong!"
export function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error) && hasErrorDetail(error)) {
    return error.data?.error?.message
  } else if (error instanceof Error && error.message) {
    return error.message
  } else {
    return DEFAULT_MESSAGE
  }
}

export function ErrorDisplay({ error }: { error: unknown }) {
  return (
    <>
      <h1>Error</h1>
      {isRouteErrorResponse(error) ? (
        <h2>
          {error.status}: {getStatusText(error)}
        </h2>
      ) : null}
      <p>{getErrorMessage(error)}</p>
    </>
  )
}
