import store from "/store"
import schema, { globalIdField } from "/graphql-schema"


const definition = /* GraphQL */`
  type IndividualProfile implements UserProfile {
    id: ID!
    name: String!
    nickname: String!
    phone: String
  }
`


const fetch = id => {
  return store.node.get("IndividualProfile", id)
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    IndividualProfile: {
      id: globalIdField(),
      fetch,
    }
  }
)
