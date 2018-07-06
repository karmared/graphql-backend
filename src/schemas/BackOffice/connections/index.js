import "./profiles"

import Schema from "/graphql-schema"


const definition = /* GraphQL */`

  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

`


Schema.add(
  Schema.BackOffice,
  definition,
)
