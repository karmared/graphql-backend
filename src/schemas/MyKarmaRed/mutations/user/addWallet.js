import is from "is_js"
import store from "/store"
import { chainFetch } from "/transport"
import { ValidationError } from "/errors"
import { createDefinition } from "/schema/utils"


const definition = `
  input AddWalletInput {
    walletId: ID!
    signedWalletId: String!
  }

  type AddWalletPayload {
    status: Boolean!
  }

  extend type Mutation {
    addWallet(input: AddWalletInput!): AddWalletPayload!
  }
`


const payloadFromInput = input => {
  return {
    oper: "validate_wallet",
    data: {
      wallet_id: input.walletId,
      signature: input.signedWalletId,
    }
  }
}


const addWallet = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  const response = await chainFetch(payloadFromInput(input))

  if (response.status === true) {
    const user = await store.node.get("User", viewer.id)
    const wallets = (user.wallets || [])
      .filter(wallet => wallet.id !== input.walletId)
      .concat({ id: input.walletId })

    await store.node.update("User", user.id, { wallets })
  }

  return {
    status: response.status
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      addWallet
    }
  }
)
