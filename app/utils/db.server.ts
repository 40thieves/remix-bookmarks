import { PrismaClient } from "@prisma/client"

let db: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient()
  db.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  db = global.__db
}

export { db }

/**
 * Utility type that "transforms" an model type into a JSON-ified version of the
 * model. This allows a model to be safely sent across the network.
 *
 * For example, properties with string/number/boolean types are preserved while
 * a property with a Date type is coerced to a string.
 */
export type JsonifyModel<Model> = {
  [Key in keyof Model]: Model[Key] extends string | number | boolean
    ? Model[Key]
    : string
}
