import is from "is_js"
import store from "/store"
import Schema from "/graphql-schema"


const definition = /* GraphQL */`

  input ProfileBankAccountsFilter {
    pendingOnly: Boolean = false
    approvedOnly: Boolean = false
  }

  type Profile {
    id: ID!
    kind: String!
    name: String!
    bankAccounts(
      filter: ProfileBankAccountsFilter = {}
    ): [BankAccount!]!
  }

`


const bankAccounts = ({ bankAccounts }, { filter }) => {
  let accounts = [].concat(bankAccounts).filter(Boolean)

  if (filter.pendingOnly === true)
    accounts = accounts.filter(account => is.not.existy(account.approved_at))

  if (filter.approvedOnly === true)
    accounts = accounts.filter(account => is.existy(account.approved_at))

  return accounts
}



const fetch = id => {
  return store.node.get("Profile", id)
}


Schema.add(
  Schema.BackOffice,
  definition,
  {
    Profile: {
      bankAccounts,

      fetch,
    }
  }
)
