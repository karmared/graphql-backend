import store from "/store"
import mailer from "/mailer"
import { ValidationError } from "/errors"
import { createDefinition } from "/schema/utils"


const definition = `

  input ResetPasswordInput {
    email: String!
  }

  type ResetPasswordPayload {
    status: Boolean!
  }

  extend type Mutation {
    resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
  }

`


const expirePasswordResetTokens = async id => {
  const connection = await store.connect()

  await store.table("tokens")
    .filter(token => {
      return store.and(
        token("user")("id").eq(id),
        token("kind").eq("password-reset")
      )
    })
    .filter(token => {
      return store.or(
        token("expired_at").default(null).eq(null),
        token("accepted_at").default(null).eq(null),
      )
    })
    .update({
      expired_at: store.now(),
      updated_at: store.now(),
    })
    .run(connection)
    .then(() => {
      connection.close()
    })
}


const resetPassword = async (root, { input }) => {
  const email = input.email.trim().toLowerCase()
  const user = await store.node.getByIndex("User", email, "email").catch(error => null)

  if (user === null)
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/email",
    })

  await expirePasswordResetTokens(user.id)

  const tokenId = await store.node.create("Token", {
    kind: "password-reset",
    user: {
      id: user.id,
    },
  })

  console.log(`Created token with id: ${tokenId}`)

  const status = await mailer({
    kind: "password-reset",
    receiver: email,
    params: {
      code: tokenId,
    }
  }).then(({ status }) => status)


  return {
    status
  }
}


export default createDefinition(
  definition, {
    Mutation: {
      resetPassword
    }
  }
)
