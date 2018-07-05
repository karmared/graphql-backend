import is from "is_js"
import fse from "fs-extra"
import path from "path"
import sharp from "sharp"
import shortid from "shortid"
import { URL } from "url"
import { signAvatar } from "./utils"
import { createDefinition } from "/schema/utils"


const definition = /* GraphQL */`

  input UploadAvatarInput {
    field: String = "avatar"
  }

  type UploadAvatarPayload {
    url: String!
    signedAvatar: String!
  }

  extend type Mutation {
    uploadAvatar(input: UploadAvatarInput = {}): UploadAvatarPayload!
  }

`


const fetchAvatar = async (files, field) => {
  const avatar = await sharp(files[field].path)
    .rotate()
    .resize(320, 320)
    .min()

  const metadata = await avatar.metadata()

  return {
    avatar,
    metadata,
  }
}


const uploadAvatar = async (root, { input }, { viewer, files }) => {
  const { avatar, metadata } = await fetchAvatar(files, input.field).catch(() => ({}))
  if (is.not.existy(avatar))
    throw new Error("Shit happens")

  const id = shortid.generate()
  const filename = `${id}.${metadata.format}`

  fse.outputFileSync(
    path.join(process.env.CDN_PATH, 'uploads', filename),
    await avatar.toBuffer()
  )

  const avatarURL = new URL(`./uploads/${filename}`, process.env.CDN_HOST)

  return {
    url: avatarURL,
    signedAvatar: signAvatar(filename, metadata, viewer)
  }
}


export default createDefinition(
  definition,
  {
    Mutation: {
      uploadAvatar,
    }
  }
)
