import schema from "/graphql-schema"


const definition = /* GraphQL */`
  type Asset {
    code: ID!
    amount: Float!
  }
`


schema.add(
  schema.KarmaRed,
  definition,
  {
    Asset: {
    }
  }
)
