import store from "/store"
import schema from "/graphql-schema"


const definition = /* GraphQL */`
  interface UserProfile {
    id: ID!
    bankAccounts: [BankAccount!]!
  }
`


const resolveType = profile => {
  switch (profile.kind) {
    case "individual":
      return "IndividualProfile"
    default:
      return null
  }
}


const fetch = ({ id, kind }) => {
  const schemaType = schema.get(schema.KarmaRed).getType(resolveType({ kind }))

  return typeof schemaType.fetch === "function"
    ? schemaType.fetch(id)
    : store.node.get(schemaType.name, id)
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    UserProfile: {
      resolveType,
      fetch,
    }
  }
)
