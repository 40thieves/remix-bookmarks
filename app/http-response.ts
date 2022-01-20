import { json } from "remix"

export function badRequest(body: any) {
  return json(body, { status: 400 })
}

export function unauthorized() {
  return new Response("Unauthorized", { status: 401 })
}
