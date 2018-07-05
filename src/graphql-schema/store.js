const Schemas = new Map()


const createSchema = () => {
  const schema = {
    definitions: [],
    resolvers: [],
  }

  schema.add = (definitions, resolvers) => {
    schema.definitions = schema.definitions.concat(definitions)
    schema.resolvers = schema.resolvers.concat(resolvers)
  }

  return schema
}


const ensureSchema = name => {
  if (!Schemas.has(name))
    Schemas.set(name, createSchema())

  return Schemas.get(name)
}


export default {
  ensureSchema
}
