import is from "is_js"
import { ValidationError } from "/errors"
import { createDefinition } from "/schema/utils"


const definition = /* GraphQL */`
  input CreateIndividualProfileInput {
    name: String!
    nickName: String!
  }


  type CreateIndividualProfilePayload {
    user: User!
    profile: IndividualProfile!
  }


  extend type Mutation {
    createIndividualProfile(
      input: CreateIndividualProfileInput!
    ): CreateIndividualProfilePayload!
  }
`


const createIndividualProfile = async (root, { input }, { viewer }) => {
  if (is.not.existy(viewer))
    throw new ValidationError({
      keyword: "presence",
      dataPath: "/viewer",
    })

  return {}
}


export default createDefinition(
  definition,
  {
    Mutation: {
      createIndividualProfile
    }
  }
)
