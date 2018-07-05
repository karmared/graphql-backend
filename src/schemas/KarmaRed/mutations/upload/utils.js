import { jwtSign } from "/utils"


export const signAvatar = (filename, metadata, user) => {
  return jwtSign({
    sub: user.id,
    format: metadata.format,
    filename: filename,
  })
}
