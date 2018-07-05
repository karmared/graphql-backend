import is from "is_js"
import DataLoader from "dataloader"
import { chainFetch } from "/transport"
import schema, { globalIdField } from "/graphql-schema"


const reduceRecords = records => {
  return records.reduce((memo, record) => {
    memo[record.id] = {
      ...record,
      __type: "Loan",
    }
    return memo
  }, {})
}


const mapRecords = ids => records => {
  return ids.map(id => {
    return records[id] ? records[id] : new Error(`Record not found`)
  })
}


const batchLoadFn = ids => {
  return chainFetch({
    oper: "get_credit_requests",
    credit_request_ids: ids,
  })
    .then(({ data }) => data.credit_requests)
    .then(reduceRecords)
    .then(mapRecords(ids))
}


const dataLoader = new DataLoader(batchLoadFn, { cache: false })


const fetch = id => {
  return dataLoader.load(id)
}


const definition = /* GraphQL */`
  type Loan implements Node {
    id: ID!
    code: String!
    memo: String!
    amount: Asset!
    period: Int!
    status: String!
    wallet: Wallet!
    percent: Int!
    collateral: Asset
    created_at: String!
  }
`


const code = loan => {
  return loan.id.split(".").pop()
}


const memo = loan => {
  return loan.loan.memo || ""
}


const amount = loan => {
  return {
    code: loan.loan.asset.asset_id,
    amount: loan.loan.asset.amount,
  }
}


const period = loan => {
  return loan.loan.period
}


const status = loan => {
  return loan.status
}


const wallet = loan => {
  const Wallet = schema.get(schema.KarmaRed).getType("Wallet")
  return Wallet.fetch(loan.borrower_id)
}


const percent = loan => {
  return loan.loan.percent
}


const collateral = loan => {
  if (is.not.existy(loan.loan.collateral)) return null
  return {
    code: loan.loan.collateral.asset_id,
    amount: loan.loan.collateral.amount,
  }
}


const created_at = loan => {
  return loan.request_creation_time
}


schema.add(
  schema.KarmaRed,
  definition,
  {
    Loan: {
      id: globalIdField(),
      code,
      memo,
      amount,
      period,
      status,
      wallet,
      percent,
      collateral,
      created_at,
      fetch,
    }
  }
)
