import store from "/store"
import { jwtSign } from "/utils"
import { ValidationError } from "/errors"
import { validatePassword } from "/utils"
import { createDefinition } from "/schema/utils"


const definition = `
  input LoginWithEmailAndPasswordInput {
    email: String!
    password: String!
  }

  type LoginWithEmailAndPasswordPayload {
    token: String!
  }

  extend type Mutation {
    loginWithEmailAndPassword(
      input: LoginWithEmailAndPasswordInput
    ): LoginWithEmailAndPasswordPayload!
  }
`


const loginWithEmailAndPassword = async (root, { input }) => {
  const email = input.email.trim().toLowerCase()

  const user = await store.node
    .getByIndex("User", email, "email")
    .catch(error => null)

  if (user === null)
    throw new ValidationError({
      keyword: "unknown",
      dataPath: "/email",
    })

  if (!validatePassword(user.password, input.password))
    throw new ValidationError({
      keyword: "mismatch",
      dataPath: "/password",
    })

  return {
    token: jwtSign({ sub: user.id })
  }
}



export default createDefinition(
  definition,
  {
    Mutation: {
      loginWithEmailAndPassword,
    }
  }
)
