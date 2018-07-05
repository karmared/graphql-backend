import is from "is_js"
import { jwtSign, jwtVerify } from "/utils"
import { ValidationError } from "/errors"


export const signPhone = (phone, userId) => {
  return jwtSign({ phone, sub: userId })
}


export const verifySignedPhone = (signedPhone, userId) => {
  if (is.not.existy(signedPhone)) return null

  try {
    const { phone, sub } = jwtVerify(signedPhone)
    if (sub !== userId) throw new Error()

    return phone
  } catch (error) {
    throw new ValidationError({
      keyword: "invalid",
      dataPath: "/signedPhone",
    })
  }
}
