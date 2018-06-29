import store from "/store"
import schema from "/schema"
import { createDefinition } from "/schema/utils"


const definition = `
  interface UserProfile {
    id: ID!
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
  const schemaType = schema.getType(resolveType({ kind }))

  return typeof schemaType.fetch === "function"
    ? schemaType.fetch(id)
    : store.node.get(schemaType.name, id)
}


export default createDefinition(
  definition,
  {
    UserProfile: {
      resolveType,
      fetch,
    }
  }
)
