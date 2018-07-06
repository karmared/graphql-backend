import is from "is_js"
import store from "/store"
import Schema from "/graphql-schema"
import { validate } from "/json-schema"
import { authorize } from "/cancan"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`

  input UpdateProfileBankAccountInput {
    profileId: ID!
    accountId: ID!
    number: String!
  }

  type UpdateProfileBankAccountPayload {
    profile: UserProfile!
  }

  extend type Mutation {
    updateProfileBankAccount(
      input: UpdateProfileBankAccountInput!
    ): UpdateProfileBankAccountPayload!
  }

`


const updateProfileBankAccount = async (root, { input }, { viewer }) => {
  const profile = await store.node.get(input.profileId)
  await authorize(viewer, "update bank account", profile)

  const account = [].concat(profile.bankAccounts)
    .filter(Boolean)
    .find(account => account.id === input.accountId)

  if (is.not.existy(account))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/bankAccount",
    })

  const attributes = {
    ...account,
    number: input.number,
  }

  await validate("bank-account", attributes)

  const accounts = profile.bankAccounts.map(account => {
    return account.id === input.accountId
      ? { ...account, ...attributes, updated_at: store.now() }
      : account
  })

  await store.node.update(
    profile.__type,
    profile.id,
    {
      bankAccounts: store.literal(accounts)
    }
  )

  return {
    profile: store.node.get(input.profileId)
  }
}


Schema.add(
  Schema.KarmaRed,
  definition,
  {
    Mutation: {
      updateProfileBankAccount
    }
  }
)
