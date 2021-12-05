import { useLoaderData } from "remix"
import { ZodSchema } from "zod"

export function useTypedLoaderData<Data>(schema: ZodSchema<Data>) {
  return schema.parse(useLoaderData())
}
