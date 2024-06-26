import bcrypt from "bcrypt"
import { createCookieSessionStorage, json, redirect } from "@remix-run/node"
import { unauthorized } from "../utils/http-response"

import { db } from "./db.server"

type LoginForm = {
  username: string
  password: string
}

export async function login({ username, password }: LoginForm) {
  let user = await db.user.findUnique({
    where: { username }
  })
  if (!user) return null

  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null

  return user
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error("SESSION_SECRET must be set")

const storage = createCookieSessionStorage({
  cookie: {
    name: "BM_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  }
})

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession()
  session.set("userId", userId)

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) }
  })
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  let session = await getUserSession(request)
  let userId = session.get("userId")

  if (!userId || typeof userId !== "string") {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }

  return parseInt(userId, 10)
}

export async function preventAnonAccess(request: Request) {
  let userId = await getUserId(request)
  if (!userId) throw unauthorized()
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request)
  let userId = session.get("userId")

  if (!userId || typeof userId !== "string") return null

  try {
    let user = await db.user.findUnique({
      select: { id: true },
      where: { id: parseInt(userId, 10) }
    })

    if (!user) return null

    return user.id
  } catch (error) {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"))

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  })
}
