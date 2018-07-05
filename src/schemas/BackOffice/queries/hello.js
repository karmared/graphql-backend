import schema from "/graphql-schema"


const definition = /* GraphQL */`
  extend type Query {
    hello: String
  }
`


schema.add(
  schema.BackOffice,
  definition,
  {
    Query: {
      hello: () => "world"
    }
  }
)
