import { json } from "remix"
import { SafeParseSuccess, ZodSchema } from "zod"

export type Validation<RequestData> =
  | SafeParseSuccess<RequestData>
  | SafeParseErrorFlattened

// Since we need to flatten the SafeParseError (as it goes over a network
// boundary), we need a modified type
type SafeParseErrorFlattened = {
  success: false
  error: {
    formErrors: string[]
    fieldErrors: {
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

  // TODO: another potential option here would be to return a badRequest directly. However this still means the caller has manually check and return so it doesn't save much
  if (validation.success) {
    return validation
  } else {
    return {
      ...validation,
      // We need to process the error so that it can be JSONified (as it is
      // sent over a network boundary), so flatten it
      error: validation.error.flatten()
    }
  }
}

export function badRequest(body: any) {
  return json(body, { status: 400 })
}
