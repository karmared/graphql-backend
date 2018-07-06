import store from "/store"
import Schema from "/graphql-schema"
import { authorize } from "/cancan"


const definition = /* GraphQL */`

  input SetViewerVisibilityInput {
    personal: Boolean!
    profiles: Boolean!
  }

  type SetViewerVisibilityPayload {
    user: User!
  }

  extend type Mutation {
    setViewerVisibility(
      input: SetViewerVisibilityInput!
    ): SetViewerVisibilityPayload!
  }

`


const setViewerVisibility = async (root, { input }, { viewer }, { schema }) => {
  await authorize(viewer, "update visibility", viewer)

  await store.node.update("User", viewer.id, {
    visibility: {
      personal: input.personal,
      profiles: input.profiles,
    }
  })

  return {
    user: schema.getType("User").fetch(viewer.id)
  }
}


Schema.add(
  Schema.KarmaRed,
  definition, {
    Mutation: {
      setViewerVisibility
    }
  }
)
