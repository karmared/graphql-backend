import schema from "/graphql-schema"


const definition = /* GraphQL */`
  interface Node {
    id: ID!
  }
`


const resolveType = ({ __type }) => __type


schema.add(
  schema.KarmaRed,
  definition,
  {
    Node: {
      resolveType
    }
  }
)
