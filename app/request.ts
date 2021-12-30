import { json } from "remix"
import { ZodError, ZodSchema } from "zod"

export type Validation<RequestData> = {
  data?: {
    [Property in keyof RequestData]?: any
  }
  errors?: {
    formErrors: string[]
    fieldErrors: {
      // TODO: it seems like [Property in keyof RequestData]: string[] should work here, but TS doesn't like it. Unsure why
      [k: string]: string[]
    }
  }
}

export async function validate<RequestData>(
  request: Request,
  schema: ZodSchema<RequestData>
): Promise<Validation<RequestData>> {
  let formData = await request.formData()
  let formEntries = Object.fromEntries(formData.entries())

  let validation = schema.safeParse(formEntries)

  return validation.success
    ? { data: validation.data }
    : { errors: validation.error.flatten() }
}

export function badRequest(body: any) {
  return json(body, { status: 400 })
}
