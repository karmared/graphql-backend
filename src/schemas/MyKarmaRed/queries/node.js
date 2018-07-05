import store from "/store"
import schema from "/schema"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    node(id: ID!): Node!
  }
`


const node = (root, args) => {
  const { type, id } = fromGlobalId(args.id)

  const schemaType = schema.getType(type)
  if (schemaType === void 0)
    throw new Error(`Unknown schema type "${type}"`)

  if (typeof schemaType.fetch === "function")
    return schemaType.fetch(id)

  return store.node.get(args.id)
}


export default createDefinition(
  definition,
  {
    Query: {
      node
    }
  }
)
