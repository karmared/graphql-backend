import store from "/store"
import schema from "/graphql-schema"
import { ValidationError } from "/errors"
import { generatePassword } from "/utils"


const definition = /* GraphQL */`

  input SetViewerPasswordInput {
    password: String!
    current_password: String
  }

  type SetViewerPasswordPayload {
    viewer: User!
  }

  extend type Mutation {
    setViewerPassword(input: SetViewerPasswordInput!): SetViewerPasswordPayload!
  }

`


const MIN_PASSWORD_LENGTH = 8


const setViewerPassword = async (root, { input }, { viewer }) => {
  if (viewer === null)
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const password = input.password.trim()
  if (password.length < MIN_PASSWORD_LENGTH)
    throw new ValidationError({
      keyword: "length",
      dataPath: "/password",
      params: {
        min: MIN_PASSWORD_LENGTH
      }
    })

  await store.node.update("User", viewer.id, {
    password: generatePassword(password)
  })

  return {
    viewer: store.node.get("User", viewer.id)
  }
}


schema.add(
  schema.KarmaRed,
  definition, {
    Mutation: {
      setViewerPassword
    }
  }
)
