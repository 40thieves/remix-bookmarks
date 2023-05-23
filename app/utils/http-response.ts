import { json } from "@remix-run/node"
import { type ValidationError, type ErrorDetails } from "./errors"

export function badRequest(body: ErrorDetails | ValidationError) {
  return json({ error: body }, { status: 400 })
}

export function unauthorized(
  body: ErrorDetails = { code: "unauthorized", message: "Unauthorized" }
) {
  return json({ error: body }, { status: 401 })
}

export function notFound(
  body: ErrorDetails = { code: "not_found", message: "Not Found" }
) {
  return json({ error: body }, { status: 404 })
}
