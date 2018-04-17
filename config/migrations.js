export default {
  tables: [
    {
      name: "users",
      indices: [
        {
          name: "email",
          fn: store => record => record("email"),
        }
      ]
    }, {
      name: "tokens"
    }
  ]
}
