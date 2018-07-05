import "./loans"

import schema from "/graphql-schema"


const definition = /* GraphQL */`
  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`


schema.add(
  schema.KarmaRed,
  definition,
)
