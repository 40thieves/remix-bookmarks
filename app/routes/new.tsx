import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect
} from "@remix-run/node"
import { Form, useActionData, useRouteError } from "@remix-run/react"
import { z } from "zod"
import { zfd } from "zod-form-data"

import { validate, Validation } from "~/utils/validation"
import { db } from "~/utils/db.server"
import { requireUserId, preventAnonAccess } from "~/utils/session.server"
import { useValidationErrors } from "~/utils/use-validation-errors"
import { badRequest } from "~/utils/http-response"
import { ErrorDisplay } from "~/utils/errors"

import stylesUrl from "~/styles/new.css"

export function meta() {
  return [{ title: `Create new bookmark | Bookmarks` }]
}

export let links: LinksFunction = () => [{ rel: "stylesheet", href: stylesUrl }]

export let loader: LoaderFunction = async ({ request }) => {
  await preventAnonAccess(request)

  return {}
}

const BookmarkSchema = zfd.formData({
  url: zfd.text(z.string().url()),
  title: zfd.text(),
  description: zfd.text(z.string().optional()),
  private: zfd.checkbox()
})

type ActionData = Validation<z.infer<typeof BookmarkSchema>>

export let action: ActionFunction = async ({ request }) => {
  await requireUserId(request)

  let validation = await validate(request, BookmarkSchema)

  if ("error" in validation) return badRequest(validation.error)

  let bookmark = await db.bookmark.create({
    data: {
      url: validation.data.url,
      title: validation.data.title,
      description: validation.data.description,
      private: validation.data.private
    }
  })

  return redirect(`/${bookmark.id}`)
}

export default function New() {
  let actionData = useActionData<ActionData>()

  let errors = useValidationErrors(actionData)

  return (
    <main className="new__container">
      <h1>Create new bookmark&hellip;</h1>
      <Form method="post" className="new__form">
        <fieldset className="new__form-row">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            className="new__input"
            {...errors.fieldErrors?.url?.inputProps}
          />
          {errors.fieldErrors?.url?.errorDisplay}
        </fieldset>

        <fieldset className="new__form-row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="new__input"
            {...errors.fieldErrors?.title?.inputProps}
          />
          {errors.fieldErrors?.title?.errorDisplay}
        </fieldset>

        <fieldset className="new__form-row">
          <label htmlFor="description">
            Description <small>(optional)</small>
          </label>
          <textarea
            name="description"
            id="description"
            className="new__input new__input--description"
            {...errors.fieldErrors?.description?.inputProps}
          />
          {errors.fieldErrors?.description?.errorDisplay}
        </fieldset>

        <fieldset className="new__form-row new__form-row--inline">
          <label htmlFor="private">Private?</label>
          <input type="checkbox" name="private" id="private" />
        </fieldset>

        {errors.formErrors || null}
        {errors.announcement}

        <button className="new__create">Create</button>
      </Form>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <ErrorDisplay error={error} />
}
