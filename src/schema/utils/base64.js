export const base64 = data => {
  return Buffer.from(data, "utf8").toString("base64")
}


export const unbase64 = data => {
  return Buffer.from(data, "base64").toString("utf8")
}
