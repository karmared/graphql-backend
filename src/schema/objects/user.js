import { chainFetch } from "/transport"
import { globalIdField, createDefinition } from "/schema/utils"


const definition = `
  type User implements Node {
    id: ID!
    email: String!
    loans: [Loan!]!
    shouldProvidePassword: Boolean!
    shouldLoginWithOTPAuth: Boolean
  }
`


const loans = async user => {
  const response = await chainFetch({
    user_id: "1.2.144",
    oper: "get_credit_request_ids",
  })
  return response.credit_request_ids.map(id => ({ id }))
}


const shouldProvidePassword = user => {
  return user.password === null || user.password === void 0
}


export default createDefinition(
  definition,
  {
    User: {
      id: globalIdField(),
      loans,
      shouldProvidePassword,
    }
  }
)
