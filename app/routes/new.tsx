import { ActionFunction, Form, useActionData } from "remix"
import { z } from "zod"
import { badRequest, validate, Validation } from "~/request"

const BookmarkSchema = z.object({
  url: z.string().min(1).url(),
  title: z.string(),
  description: z.string()
})

type ActionData = Validation<z.infer<typeof BookmarkSchema>>

export let action: ActionFunction = async ({ request }) => {
  let { data, errors } = await validate(request, BookmarkSchema)

  if (errors) return badRequest({ errors })

  // TODO

  return data
}

export default function New() {
  let actionData = useActionData<ActionData>()

  let errors = useValidationErrors(actionData?.errors?.fieldErrors)

  return (
    <Form method="post">
      <div>
        <label htmlFor="url">URL</label>
        <input type="text" name="url" id="url" {...errors.url?.inputProps} />
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
          {...errors.title?.inputProps}
        />
        {errors.title?.errorDisplay}
      </div>

      <div>
        <label htmlFor="description">
          Description <small>(optional)</small>
        </label>
        <input
          type="text"
          name="description"
          id="description"
          {...errors.description?.inputProps}
        />
        {errors.description?.errorDisplay}
      </div>

      <button>Create</button>
    </Form>
  )
}

type ErrorEntries = {
  [k: string]: string[]
}

function useValidationErrors(errors: ErrorEntries = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([name, errors]) => {
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
