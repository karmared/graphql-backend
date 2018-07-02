import is from "is_js"
import store from "/store"
import schema from "/schema"
import { validate } from "/json-schema"
import { ValidationError } from "/errors"
import { createDefinition } from "/schema/utils"
import { verifySignedPhone } from "./utils"


const definition = /* GraphQL */`
  input CreateIndividualProfileInput {
    name: String!
    nickname: String!
    signedPhone: String
  }


  type CreateIndividualProfilePayload {
    user: User!
    profile: IndividualProfile!
  }


  extend type Mutation {
    createIndividualProfile(
      input: CreateIndividualProfileInput!
    ): CreateIndividualProfilePayload!
  }
`


const isIndividualProfileExists = async userId => {
  const connection = await store.connect()

  return store.table("user_profiles")
    .filter(profile => profile("user")("id").eq(userId))
    .filter(profile => profile("kind").eq("individual"))
    .count()
    .gt(0)
    .run(connection)
    .then(result => {
      connection.close()
      return result
    })
}


const createIndividualProfile = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })


  if (await isIndividualProfileExists(viewer.id))
    throw new ValidationError({
      keyword: "uniqueness",
      dataPath: "/profile",
    })


  const attributes = {
    ...input,
  }

  const phone = verifySignedPhone(input.signedPhone, viewer.id)
  if (is.existy(phone)) attributes.phone = phone

  await validate("individual-profile", attributes)

  const profileId = await store.node.create(
    "IndividualProfile",
    {
      ...attributes,
      kind: "individual",
      user: {
        id: viewer.id,
      },
    }
  )

  return {
    user: viewer,
    profile: schema.getType("IndividualProfile").fetch(profileId),
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      createIndividualProfile
    }
  }
)
