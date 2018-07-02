import is from "is_js"
import store from "/store"
import { validate } from "/json-schema"
import { jwtVerify } from "/utils"
import { ValidationError } from "/errors"
import { fromGlobalId, createDefinition } from "/schema/utils"


const definition = /* GraphQL */`
  input UpdateIndividualProfileInput {
    id: ID!
    name: String!
    nickname: String!
    signedPhone: String
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
        ? record
        : null
    })
    .catch(() => {
      connection.close()
      return null
    })
}


const verifySignedPhone = (signedPhone, userId) => {
  if (is.not.existy(signedPhone)) return null

  try {
    const { phone, sub } = jwtVerify(signedPhone)
    if (sub !== userId) throw new Error()

    return phone
  } catch (error) {
    throw new ValidationError({
      keyword: "invalid",
      dataPath: "/signedPhone",
    })
  }
}


const updateIndividualProfile = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const profile = await findIndividualProfileForUser(viewer.id, input.id)
  if (is.not.existy(profile))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/profile",
    })

  const attributes = {
    ...profile,
    ...input,
  }

  const phone = verifySignedPhone(input.signedPhone, viewer.id)
  if (is.existy(phone)) attributes.phone = phone

  await validate("individual-profile", attributes)

  await store.node.update(
    "IndividualProfile",
    profile.id,
    attributes,
  )

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
