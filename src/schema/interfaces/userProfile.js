import { createDefinition } from "/schema/utils"


const definition = `
  interface UserProfile {
    id: ID!
    kind: String!
  }
`


const resolveType = profile => profile.kind


export default createDefinition(
  definition,
  {
    UserProfile: {
      resolveType
    }
  }
)
