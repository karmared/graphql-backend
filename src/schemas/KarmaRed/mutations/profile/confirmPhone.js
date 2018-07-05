import is from "is_js"
import store from "/store"
import schema from "/graphql-schema"
import { signPhone } from "./utils"
import { normalizePhone } from "/utils"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`
  input ConfirmPhoneInput {
    phone: String!
    token: String!
  }

  type ConfirmPhonePayload {
    signedPhone: String!
  }

  extend type Mutation {
    confirmPhone(
      input: ConfirmPhoneInput!
    ): ConfirmPhonePayload!
  }
`


const findConfirmationToken = async (userId, phone, token) => {
  const connection = await store.connect()

  return store.table("tokens")
    .filter(record => record("user")("id").eq(userId))
    .filter(record => {
      return store.and(
        record("kind").eq("phone-confirmation"),
        record("token").eq(token),
        record("phone").eq(phone),
      )
    })
    .nth(0)
    .run(connection)
    .then(record => {
      connection.close()
      return record
    })
    .catch(() => {
      connection.close()
      return null
    })
}


const confirmPhone = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const phone = normalizePhone(input.phone)
  if (is.not.existy(phone))
    throw new ValidationError({
      keyword: "format",
      dataPath: "/phone",
    })

  const token = await findConfirmationToken(viewer.id, phone, input.token)
  if (is.not.existy(token))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/token",
    })

  if (is.existy(token.expired_at))
    throw new ValidationError({
      keyword: "expired",
      dataPath: "/token",
    })

  if (is.existy(token.activated_at))
    throw new ValidationError({
      keyword: "activated",
      dataPath: "/token",
    })

  await store.node.update("Token", token.id, {
    activated_at: store.now()
  })

  return {
    signedPhone: signPhone(phone, viewer.id)
  }
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Mutation: {
      confirmPhone
    }
  }
)
