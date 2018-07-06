import Schema from "/graphql-schema"
import { format } from "date-fns"


const definition = /* GraphQL */`

  type BankAccountApproval {
    amount: Int!
    account: String!
  }

  type BankAccount {
    id: ID!
    number: String!
    approval: BankAccountApproval
    approvedAt: String
  }

`


const approvedAt = ({ approved_at }) => approved_at && format(approved_at)


Schema.add(
  Schema.BackOffice,
  definition,
  {
    BankAccount: {
      approvedAt
    }
  }
)
