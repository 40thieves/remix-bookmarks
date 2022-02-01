import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useCatch
} from "remix"
import { z } from "zod"

import { validate, Validation } from "~/utils/validation"
import { db } from "~/utils/db.server"
import { requireUserId, preventAnonAccess } from "~/utils/session.server"
import { useValidationErrors } from "~/utils/use-validation-errors"
import { badRequest } from "~/utils/http-response"

import stylesUrl from "~/styles/new.css"

export let meta: MetaFunction = () => ({
  title: `Create new bookmark | Bookmarks`
})

export let links: LinksFunction = () => [{ rel: "stylesheet", href: stylesUrl }]

export let loader: LoaderFunction = async ({ request }) => {
  await preventAnonAccess(request)

  return {}
}

const BookmarkSchema = z.object({
  url: z.string().min(1).url(),
  title: z.string(),
  description: z.string()
})

type ActionData = Validation<z.infer<typeof BookmarkSchema>>

export let action: ActionFunction = async ({ request }) => {
  let userId = await requireUserId(request)
  let validation = await validate(request, BookmarkSchema)

  if ("error" in validation) return badRequest({ error: validation.error })

  let bookmark = await db.bookmark.create({
    data: {
      url: validation.data.url,
      title: validation.data.title,
      description: validation.data.description,
      userId
    }
  })

  return redirect(`/${bookmark.id}`)
}

export default function New() {
  let actionData = useActionData<ActionData>()

  let errors = useValidationErrors(actionData)

  return (
    <main>
      <h2>Create new bookmark&hellip;</h2>
      <Form method="post" className="new__form">
        <div>
          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            className="new__input"
            {...errors.url?.inputProps}
          />
          {errors.url?.errorDisplay}
        </div>

        <div>
          <label htmlFor="title">
            Title <small>(optional)</small>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="new__input"
            {...errors.title?.inputProps}
          />
          {errors.title?.errorDisplay}
        </div>

        <div>
          <label htmlFor="description">
            Description <small>(optional)</small>
          </label>
          <textarea
            name="description"
            id="description"
            className="new__input new__input--description"
            {...errors.description?.inputProps}
          />
          {errors.description?.errorDisplay}
        </div>

        <button className="new__create">Create</button>
      </Form>
    </main>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div className="alert--danger">
        <p>You must be logged in to create a bookmark.</p>
        <Link to="/login" className="alert__link">
          Log in
        </Link>
      </div>
    )
  }
}
