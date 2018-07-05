import "./objects"
import "./queries"
import "./mutations"
import "./interfaces"
import "./connections"

import schema from "/graphql-schema"


const definition = /* GraphQL */`
  type Query
  type Mutation
`


schema.add(
  schema.KarmaRed,
  definition,
)
