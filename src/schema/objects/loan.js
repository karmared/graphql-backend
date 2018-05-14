import DataLoader from "dataloader"
import { chainFetch } from "/transport"
import { globalIdField, createDefinition } from "/schema/utils"


const reduceRecords = records => {
  return records.reduce((memo, record) => {
    console.log(record)
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
    .then(({ credit_requests }) => credit_requests)
    .then(reduceRecords)
    .then(mapRecords(ids))
}


const dataLoader = new DataLoader(batchLoadFn, { cache: false })


const fetch = id => {
  return dataLoader.load(id)
}


const definition = `
  type Loan implements Node {
    id: ID!
    memo: String!
    status: String!
    period: Int!
    percent: Int!
    created_at: String!
  }
`


const memo = loan => {
  return loan.loan.memo || ""
}


const status = loan => {
  return loan.status
}


const period = loan => {
  return loan.loan.period
}


const percent = loan => {
  return loan.loan.percent
}


const created_at = loan => {
  return loan.request_creation_time
}


export default createDefinition(
  definition,
  {
    Loan: {
      id: globalIdField(),
      memo,
      status,
      period,
      percent,
      created_at,
      fetch,
    }
  }
)
