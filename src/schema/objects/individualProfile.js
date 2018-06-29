import store from "/store"
import { globalIdField, createDefinition } from "/schema/utils"


const definition = `
  type IndividualProfile implements UserProfile {
    id: ID!
    name: String!
    nickname: String!
  }
`


const fetch = id => {
  return store.node.get("IndividualProfile", id)
}


export default createDefinition(
  definition,
  {
    IndividualProfile: {
      id: globalIdField(),
      fetch,
    }
  }
)
