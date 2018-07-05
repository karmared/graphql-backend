import is from "is_js"
import store from "/store"
import { ValidationError } from "/errors"
import schema, { fromGlobalId } from "/graphql-schema"


const definition = /* GraphQL */`
  input RemoveProfileInput {
    id: ID!
  }

  type RemoveProfilePayload {
    user: User!
  }

  extend type Mutation {
    removeProfile(input: RemoveProfileInput!): RemoveProfilePayload!
  }
`


const findProfileForUser = async (userId, profileId) => {
  const connection = await store.connect()

  return store.table("user_profiles")
    .filter(profile => profile("user")("id").eq(userId))
    .filter(profile => profile("id").eq(profileId))
    .nth(0)
    .run(connection)
    .then(record => {
      connection.close()
      return record
    })
    .catch((error) => {
      connection.close()
      return null
    })
}


const removeProfile = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const profile = await findProfileForUser(
    viewer.id,
    fromGlobalId(input.id).id,
  )
  if (is.not.existy(profile))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/profile",
    })

  await store.node.remove(
    schema.get(schema.KarmaRed).getType("UserProfile").resolveType(profile),
    profile.id,
  )

  return {
    user: schema.get(schema.KarmaRed).getType("User").fetch(viewer.id)
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      removeProfile,
    }
  }
)
