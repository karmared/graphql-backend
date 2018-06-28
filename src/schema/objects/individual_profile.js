import { globalIdField, createDefinition } from "/schema/utils"


const definition = `

  type UserPhone {
    number: String!
    validatedAt: String!
  }

  type UserAvatar {
    id: ID!
    url: String!
  }

  type IndividualProfile {
    id: ID!
    fullName: String!
    nickName: String!
    phone: UserPhone
    avatar: UserAvatar
  }

`


export default createDefinition(
  definition,
  {
    UserPhone: {

    },
    UserAvatar: {

    },
    IndividualProfile: {

    }
  }
)
