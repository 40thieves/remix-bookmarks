import { ActionFunction, LinksFunction } from "@remix-run/node"
import { Form, useActionData, useSearchParams } from "@remix-run/react"
import { z } from "zod"

import { validate, Validation } from "~/utils/validation"
import { createUserSession, login } from "~/utils/session.server"
import { useValidationErrors } from "~/utils/use-validation-errors"
import { badRequest } from "~/utils/http-response"

import stylesUrl from "~/styles/login.css"

export let links: LinksFunction = () => [{ rel: "stylesheet", href: stylesUrl }]

const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  redirectTo: z.string()
})

type ActionData = Validation<z.infer<typeof LoginSchema>>

export let action: ActionFunction = async ({ request }) => {
  let validation = await validate(request, LoginSchema)

  if ("error" in validation) return badRequest({ error: validation.error })

  let user = await login({
    username: validation.data.username,
    password: validation.data.password
  })

  if (!user) {
    return badRequest({
      error: { formError: ["Username/password combination is incorrect"] }
    })
  }

  return createUserSession(`${user.id}`, validation.data.redirectTo || "/")
}

export default function Login() {
  const actionData = useActionData<ActionData>()
  let errors = useValidationErrors(actionData)

  const [searchParams] = useSearchParams()

  return (
    <main>
      <h2>Log in</h2>
      <Form method="post" className="login__form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            className="login__input"
            {...errors.username?.inputProps}
          />
          {errors.username?.errorDisplay}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="login__input"
            {...errors.password?.inputProps}
          />
          {errors.password?.errorDisplay}
        </div>

        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />

        <button className="login__submit">Log in</button>
      </Form>
    </main>
  )
}
