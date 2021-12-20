import { Form } from "remix"

export default function AdminNew() {
  return (
    <Form method="post">
      <div>
        <label htmlFor="url">URL</label>
        <input type="text" name="url" id="url" />
      </div>

      <div>
        <label htmlFor="description">
          Description <small>(optional)</small>
        </label>
        <input type="text" name="description" id="description" />
      </div>
    </Form>
  )
}
