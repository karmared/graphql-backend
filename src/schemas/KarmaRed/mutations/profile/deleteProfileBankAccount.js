import is from "is_js"
import store from "/store"
import Schema from "/graphql-schema"
import { validate } from "/json-schema"
import { authorize } from "/cancan"
import { bankFetch } from "/transport"
import { ValidationError } from "/errors"


const definition = /* GraphQL */`

  input DeleteProfileBankAccountInput {
    profileId: ID!
    accountId: ID!
  }


  type DeleteProfileBankAccountPayload {
    profile: UserProfile!
  }


  extend type Mutation {
    deleteProfileBankAccount(
      input: DeleteProfileBankAccountInput!
    ): DeleteProfileBankAccountPayload!
  }

`


const cancelAccountApproval = ({ profile, account }) => {
  return bankFetch({
    action: "cancel_account",
    data: {
      profile_id: `${profile.id}:${account.id}`,
      account: account.number,
    }
  })
}


const deleteProfileBankAccount = async (root, { input }, { viewer }) => {
  const profile = await store.node.get(input.profileId)
  await authorize(viewer, "delete bank account", profile)

  const account = [].concat(profile.bankAccounts)
    .filter(Boolean)
    .find(account => account.id === input.accountId)

  if (is.not.existy(account))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/bankAccount",
    })

  await cancelAccountApproval({ profile, account })

  const accounts = profile.bankAccounts
    .filter(account => account.id !== input.accountId)

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
      deleteProfileBankAccount
    }
  }
)
