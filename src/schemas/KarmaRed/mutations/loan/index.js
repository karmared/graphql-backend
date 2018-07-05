import "./acceptLoan"
import "./cancelLoan"
import "./redeemLoan"
import "./requestLoan"
import "./transferFunds"

import schema from "/graphql-schema"


const definition = /* GraphQL */`
  input AssetInput {
    amount: Float!
    assetId: ID!
  }
`


schema.add(
  schema.KarmaRed,
  definition,
)
