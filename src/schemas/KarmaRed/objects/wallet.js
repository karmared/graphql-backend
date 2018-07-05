import DataLoader from "dataloader"
import { chainFetch } from "/transport"
import schema, { globalIdField } from "/graphql-schema"


const reduceRecords = records => {
  return records.reduce((memo, record) => {
    memo[record.id] = {
      ...record,
      __type: "Wallet",
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
    oper: "get_wallets_info",
    wallet_ids: ids,
  })
    .then(({ data }) => data.wallets)
    .then(reduceRecords)
    .then(mapRecords(ids))
}


const dataLoader = new DataLoader(batchLoadFn, { cache: false })


const fetch = id => {
  return dataLoader.load(id)
}



const definition = /* GraphQL */`
  type Wallet implements Node {
    id: ID!
    name: String!
    karma: Float!
  }
`


schema.add(
  schema.KarmaRed,
  definition,
  {
    Wallet: {
      fetch,
    }
  }
)
