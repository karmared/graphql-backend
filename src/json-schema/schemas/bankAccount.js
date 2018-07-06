export default {
  $id: "bank-account",
  $async: true,
  required: ["number"],
  properties: {
    number: {
      type: "string",
      minLength: 12,
    },
  },
  additionalProperties: false,
}
