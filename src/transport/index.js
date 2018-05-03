import { ChainError } from "/errors"
import { fetch } from "@karmared/kafka-transport"


const mailerFetch = payload => {
  return fetch(
    process.env.KARMA_MAIL_TO_TOPIC,
    process.env.KARMA_MAIL_FROM_TOPIC,
    payload
  )
}


const chainFetch = payload => {
  return fetch(
    process.env.KARMA_CHAIN_TO_TOPIC,
    process.env.KARMA_CHAIN_FROM_TOPIC,
    payload
  ).then(response => {
    if (response.error)
      throw new ChainError(response.error)
    return response
  })
}


export {
  chainFetch,
  mailerFetch,
}
