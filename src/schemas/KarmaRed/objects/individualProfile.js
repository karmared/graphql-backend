import store from "/store"
import Schema, { globalIdField } from "/graphql-schema"


const definition = /* GraphQL */`
  type IndividualProfile implements UserProfile {
    id: ID!
    name: String!
    nickname: String!
    phone: String
    bankAccounts: [BankAccount!]!
  }
`


const bankAccounts = profile => {
  return [].concat(profile.bankAccounts).filter(Boolean)
}


const fetch = id => {
  return store.node.get("IndividualProfile", id)
}


Schema.add(
  Schema.KarmaRed,
  definition,
  {
    IndividualProfile: {
      id: globalIdField(),
      bankAccounts,
      fetch,
    }
  }
)
