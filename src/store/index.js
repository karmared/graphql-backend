import "/env"
import r from "rethinkdb"
import url from "url"
import node from "./node"


const config = url.parse(process.env.RETHINKDB_CONNECTION)


const connect = r.connect


r.connect = () => {
  const [,db] = (config.pathname || "/test").split("/")
  const [host, port] = config.host.split(":")
  const [user, password] = (config.auth || "admin").split(":")

  return connect({
    db,
    host,
    port,
    user,
    password,
  })
}


r.node = node


export default r
