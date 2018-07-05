import "./queries"
import schema from "/graphql-schema"


const definition = /* GraphQL */`
  type Query
`


schema.add(
  schema.BackOffice,
  definition,
)
