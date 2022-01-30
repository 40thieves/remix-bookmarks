import { json } from "remix"

export function badRequest(body: any) {
  return json(body, { status: 400 })
}

export function unauthorized() {
  return json("Unauthorized", { status: 401 })
}

export function notFound() {
  return json("Not Found", { status: 404 })
}
