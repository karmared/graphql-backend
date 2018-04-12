const definition = `
  extend type Query {
    node(id: ID!): Node!
  }
`


const enhancement = {
  Query: {
    node: (root, { id }) => {
      return null
    }
  }
}


export default {
  definition,
  enhancement,
}
