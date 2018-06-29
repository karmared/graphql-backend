export default {
  $id: "individual-profile",
  $async: true,
  required: ["name", "nickname"],
  properties: {
    name: {
      type: "string",
      minLength: 3,
    },

    nickname: {
      type: "string",
      minLength: 1
    }
  },
  additionalProperties: false,
}
