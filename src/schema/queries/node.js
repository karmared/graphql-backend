import store from "/store"
import { createDefinition } from "/schema/utils"


const definition = `
  extend type Query {
    node(id: ID!): Node!
  }
`


const node = (root, { id }) => {
  return store.node.get(id)
}


export default createDefinition(
  definition,
  {
    Query: {
      node
    }
  }
)
