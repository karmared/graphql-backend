import is from "is_js"
import store from "/store"
import schema from "/schema"
import shortid from "shortid"
import jsonSchema from "/json-schema"
import { ValidationError } from "/errors"
import { createDefinition } from "/schema/utils"


const definition = /* GraphQL */`
  input CreateIndividualProfileInput {
    name: String!
    nickname: String!
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


const create = async (userId, attributes) => {
  const id = shortid.generate()

  const connection = await store.connect()
  await store.table("user_profiles")
    .insert({
      ...attributes,
      id,
      kind: "individual",
      user: {
        id: userId,
      },
      created_at: store.now(),
    })
    .run(connection)
    .then(() => {
      connection.close()
    })

  return id
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


  await jsonSchema.validate("individual-profile", input)
    .catch(error => {
      throw new ValidationError(error.errors)
    })

  const profileId = await create(viewer.id, input)

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
