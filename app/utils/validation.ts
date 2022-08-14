import {
  SafeParseSuccess,
  ZodEffects,
  ZodObject,
  ZodRawShape,
  ZodSchema,
  ZodTypeAny
} from "zod"

export type Validation<RequestData> =
  | SafeParseSuccess<RequestData>
  | SafeParseErrorFlattened

// Since we need to flatten the SafeParseError (as it goes over a network
// boundary), we need a modified type
type SafeParseErrorFlattened = {
  success: false
  error: {
    formErrors?: string[]
    fieldErrors?: {
      [k: string]: string[]
    }
  }
}

export async function validate(
  request: Request,
  schema: ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny>> // TODO: maybe this can be simplified? zod-form-data doesn't seem to export a useful type
) {
  let validation = schema.safeParse(await request.formData())

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
