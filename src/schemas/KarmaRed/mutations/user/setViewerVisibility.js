import store from "/store"
import schema from "/graphql-schema"
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


const setViewerVisibility = async (root, { input }, { viewer }) => {
  await authorize(viewer, "update visibility", viewer)

  await store.node.update("User", viewer.id, {
    visibility: {
      personal: input.personal,
      profiles: input.profiles,
    }
  })

  return {
    user: store.node.get("User", viewer.id)
  }
}


schema.add(
  schema.KarmaRed,
  definition, {
    Mutation: {
      setViewerVisibility
    }
  }
)
