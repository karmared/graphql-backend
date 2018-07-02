import store from "/store"
import schema from "/schema"
import { globalIdField, createDefinition } from "/schema/utils"


const definition = `
  type User implements Node {
    id: ID!
    email: String!

    shouldProvidePassword: Boolean!
    shouldLoginWithOTPAuth: Boolean

    profiles: [UserProfile!]!
  }
`


const shouldProvidePassword = user => {
  return user.password === null || user.password === void 0
}


const profiles = async user => {
  const connection = await store.connect()

  const ids = await store.table("user_profiles")
    .filter(profile => profile("user")("id").eq(user.id))
    .pluck(["id", "kind"])
    .run(connection)
    .then(cursor => {
      return cursor.toArray()
    })
    .then(ids => {
      connection.close()
      return ids
    })

  const UserProfile = schema.getType("UserProfile")

  return ids.map(id => UserProfile.fetch(id))
}


const fetch = id => {
  return store.node.get("User", id)
}


export default createDefinition(
  definition,
  {
    User: {
      id: globalIdField(),
      shouldProvidePassword,
      profiles,
      fetch,
    }
  }
)
