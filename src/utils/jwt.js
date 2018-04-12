import fs from "fs"
import jwt from "jsonwebtoken"
import path from "path"


const PRIVATE_KEY = fs.readFileSync(
  path.resolve(process.cwd(), 'jwtRS256.key')
)


const PUBLIC_KEY = fs.readFileSync(
  path.resolve(process.cwd(), 'jwtRS256.key.pub')
)


export const jwtSign = payload => {
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: "RS256" })
}


export const jwtVerify = token => {
  return jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] })
}
