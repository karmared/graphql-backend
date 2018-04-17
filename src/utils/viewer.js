import store from "/store"
import { jwtVerify } from "/utils"


const TOKEN_PREFIX="Bearer "


const fetchViewer = async token => {
  const { sub } = jwtVerify(token)
  return store.node.get("User", sub).catch(error => null)
}


export const authorization = async ctx => {
  ctx.token = null
  ctx.viewer = null

  const token = ctx.headers.authorization

  if (token === void 0) return
  if (token.indexOf(TOKEN_PREFIX) !== 0) return

  ctx.token = token.replace(TOKEN_PREFIX, "")

  ctx.viewer = await fetchViewer(ctx.token).catch(() => null)
}
