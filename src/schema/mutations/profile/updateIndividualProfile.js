import is from "is_js"
import store from "/store"
import jsonSchema from "/json-schema"
import { ValidationError } from "/errors"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = /* GraphQL */`
  input UpdateIndividualProfileInput {
    id: ID!
    name: String!
    nickname: String!
  }

  type UpdateIndividualProfilePayload {
    profile: IndividualProfile!
  }

  extend type Mutation {
    updateIndividualProfile(
      input: UpdateIndividualProfileInput!
    ): UpdateIndividualProfilePayload!
  }
`


const findIndividualProfileForUser = async (userId, profileId) => {
  const connection = await store.connect()

  return store.table("user_profiles")
    .filter(profile => profile("user")("id").eq(userId))
    .filter(profile => profile("kind").eq("individual"))
    .nth(0)
    .run(connection)
    .then(record => {
      connection.close()
      return fromGlobalId(profileId).id === record.id
        ? record.id
        : null
    })
    .catch(() => {
      connection.close()
      return null
    })
}


const update = async (profileId, attributes) => {
  const connection = await store.connect()
  await store.table("user_profiles")
    .get(profileId)
    .update({
      ...attributes,
      updated_at: store.now(),
    })
    .run(connection)
    .then(() => {
      connection.close()
    })

  return true
}


const updateIndividualProfile = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const profileId = await findIndividualProfileForUser(viewer.id, input.id)
  if (is.not.existy(profileId))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/profile",
    })

  const attributes = {...input}

  await jsonSchema.validate("individual-profile", attributes)
    .catch(error => {
      throw new ValidationError(error.errors)
    })

  await update(profileId, attributes)

  return {
    profile: store.node.get(input.id)
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      updateIndividualProfile,
    }
  }
)
