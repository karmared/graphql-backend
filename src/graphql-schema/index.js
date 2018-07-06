import is from "is_js"
import store from "./store"
import enhance from "./enhance"


const add = (name, definition, resolvers) => {
  const schema = store.ensureSchema(name)
  schema.add(definition, resolvers)
}


const get = name => {
  const schema = store.ensureSchema(name)

  if (is.not.existy(schema.build))
    schema.build = enhance(schema.definitions, schema.resolvers)

  return schema.build
}


export default {
  add,
  get,
  KarmaRed: Symbol("Karma.Red"),
  BackOffice: Symbol("BackOffice"),
}


export * from "./errors"
export * from "./globalId"
export * from "./connection"
