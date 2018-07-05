import store from "/store"
import schema, { fromGlobalId } from "/graphql-schema"


const definition = /* GraphQL */`
  extend type Query {
    node(id: ID!): Node!
  }
`


const node = (root, args) => {
  const { type, id } = fromGlobalId(args.id)

  const schemaType = schema.get(schema.KarmaRed).getType(type)
  if (schemaType === void 0)
    throw new Error(`Unknown schema type "${type}"`)

  if (typeof schemaType.fetch === "function")
    return schemaType.fetch(id)

  return store.node.get(args.id)
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Query: {
      node
    }
  }
)
