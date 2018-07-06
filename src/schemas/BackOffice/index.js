import "./objects"
import "./queries"
import "./connections"

import Schema from "/graphql-schema"


const definition = /* GraphQL */`
  type Query
`


Schema.add(
  Schema.BackOffice,
  definition,
)
