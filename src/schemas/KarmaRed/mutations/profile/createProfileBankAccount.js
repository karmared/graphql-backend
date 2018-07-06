import store from "/store"
import Schema from "/graphql-schema"
import shortid from "shortid"
import { validate } from "/json-schema"
import { authorize } from "/cancan"
import { bankFetch } from "/transport"


const definition = /* GraphQL */`

  input CreateProfileBankAccountInput {
    id: ID!
    number: String!
  }

  type CreateProfileBankAccountPayload {
    profile: UserProfile!
  }

  extend type Mutation {
    createProfileBankAccount(
      input: CreateProfileBankAccountInput!
    ): CreateProfileBankAccountPayload!
  }

`


const requestApprovalInfo = ({ profile, account }) => {
  return bankFetch({
    action: "approval",
    data: {
      profile_id: `${profile.id}:${account.id}`,
      account: account.number,
    }
  })
}


const createProfileBankAccount = async (root, { input }, { viewer }, { schema }) => {
  const profile = await store.node.get(input.id)

  await authorize(viewer, "create bank account", profile)

  const bankAccounts = [].concat(profile.bankAccounts).filter(Boolean)

  const attributes = {
    number: input.number
  }

  await validate("bank-account", attributes)

  attributes.id = shortid.generate()

  const response = await requestApprovalInfo({ profile, account: attributes })
  if (response.status === false)
    attributes.approved_at = store.now()
  else
    attributes.approval = {
      amount: response.data.amount,
      account: response.data.account,
    }

  await store.node.update(
    profile.__type,
    profile.id,
    {
      bankAccounts: [
        ...bankAccounts,
        {
          ...attributes,
          created_at: store.now(),
        }
      ]
    }
  )

  return {
    profile: store.node.get(input.id)
  }
}


Schema.add(
  Schema.KarmaRed,
  definition,
  {
    Mutation: {
      createProfileBankAccount,
    }
  }
)
