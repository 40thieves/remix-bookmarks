import {
  ActionFunction,
  Form,
  LinksFunction,
  MetaFunction,
  redirect,
  useActionData
} from "remix"
import { z } from "zod"

import { badRequest, validate, Validation } from "~/request"
import { db } from "~/utils/db.server"

import stylesUrl from "~/styles/new.css"

export let meta: MetaFunction = () => ({
  title: `Bookmarks | Create new bookmark`
})

export let links: LinksFunction = () => [{ rel: "stylesheet", href: stylesUrl }]

const BookmarkSchema = z.object({
  url: z.string().min(1).url(),
  title: z.string(),
  description: z.string()
})

type ActionData = Validation<z.infer<typeof BookmarkSchema>>

export let action: ActionFunction = async ({ request }) => {
  let validation = await validate(request, BookmarkSchema)

  if ("error" in validation) return badRequest({ error: validation.error })

  let bookmark = await db.bookmark.create({
    data: {
      url: validation.data.url,
      title: validation.data.title,
      description: validation.data.description
    }
  })

  return redirect(`/${bookmark.id}`)
}

export default function New() {
  let actionData = useActionData<ActionData>()

  let errors = useValidationErrors(actionData)

  return (
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
  )
}

function useValidationErrors(data?: Validation<any>) {
  if (!data || !("error" in data)) return {}

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
