const encUrlSafe = string => {
  return string.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "")
}


const enc = string => {
  return encUrlSafe(Buffer.from(string, "utf8").toString("base64"))
}


const dec = string => {
  return Buffer.from(string, "base64").toString("utf8")
}


export const base64 = {
  enc,
  dec,
}
