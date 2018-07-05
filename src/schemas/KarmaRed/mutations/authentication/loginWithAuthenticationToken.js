import store from "/store"
import schema from "/graphql-schema"
import { jwtSign } from "/utils"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`
  input LoginWithAuthenticationTokenInput {
    token: String!
  }

  type LoginWithAuthenticationTokenPayload {
    kind: String!
    token: String!
  }

  extend type Mutation {
    loginWithAuthenticationToken(
      input: LoginWithAuthenticationTokenInput!
    ): LoginWithAuthenticationTokenPayload!
  }
`


const validateToken = token => {
  if (token === null)
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/token",
    })

  if (token.expired_at)
    throw new ValidationError({
      keyword: "expired",
      dataPath: "/token",
    })

  if (token.accepted_at)
    throw new ValidationError({
      keyword: "accepted",
      dataPath: "/token",
    })
}


const tokenSideEffect = async token => {
  switch (token.kind) {
    case "password-reset":
      await store.node.update("User", token.user.id, {
        password: null
      })
      return
    default:
      return
  }
}


const ensureUserByToken = async token => {
  if (token.user && token.user.id)
    return store.node.get("User", token.user.id).catch(error => null)

  if (token.email) {
    const user = await store.node.getByIndex("User", token.email, "email").catch(error => null)

    if (user !== null) return user

    const id = await store.node.create("User", {
      email: token.email
    })

    return store.node.get("User", id).catch(error => null)
  }
}


const loginWithAuthenticationToken = async (root, { input }) => {
  const token = await store.node.get("Token", input.token).catch(error => null)

  validateToken(token)
  const user = await ensureUserByToken(token)

  if (user === null)
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/user",
    })

  await tokenSideEffect(token)

  await store.node.update("Token", token.id, {
    accepted_at: store.now()
  })

  return {
    kind: token.kind,
    token: jwtSign({ sub: user.id }),
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      loginWithAuthenticationToken
    }
  }
)
