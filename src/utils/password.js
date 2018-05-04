import is from "is_js"
import crypto from "crypto"


const generateSalt = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
}


const generateHash = (password, salt) => {
  return crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("hex")
}


export const generatePassword = password => {
  const salt = generateSalt(16)
  const hash = generateHash(password, salt)
  return [salt, hash].join(":")
}


export const validatePassword = (digest, password) => {
  if (is.not.existy(digest))
    return false

  const [salt, hash] = digest.split(":")
  return hash === generateHash(password, salt)
}
