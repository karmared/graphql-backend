import { format } from "date-fns"
import Schema, { globalIdField } from "/graphql-schema"


const definition = /* GraphQL */`

  type BankAccountApproval {
    amount: Int!
    account: String!
  }

  type BankAccount {
    id: ID!
    number: String!
    approval: BankAccountApproval
    approved_at: String
  }

`


const approved_at = account => {
  return account.approved_at && format(account.approved_at)
}


Schema.add(
  Schema.KarmaRed,
  definition,
  {
    BankAccount: {
      approved_at,
    }
  }
)
