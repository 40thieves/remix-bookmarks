import { ActionFunction, Form } from "remix"
import { z } from "zod"
import { validate, badRequest } from "~/request"

const BookmarkSchema = z.object({
  url: z.string().min(1).url(),
  title: z.string(),
  description: z.string()
})

export let action: ActionFunction = async ({ request }) => {
  let { data, errors } = await validate(request, BookmarkSchema)

  if (errors) return badRequest({ errors })

  // TODO

  return data
}

export default function New() {
  return (
    <Form method="post">
      <div>
        <label htmlFor="url">URL</label>
        <input type="text" name="url" id="url" />
      </div>

      <div>
        <label htmlFor="title">
          Title <small>(optional)</small>
        </label>
        <input type="text" name="title" id="title" />
      </div>

      <div>
        <label htmlFor="description">
          Description <small>(optional)</small>
        </label>
        <input type="text" name="description" id="description" />
      </div>

      <button>Create</button>
    </Form>
  )
}
