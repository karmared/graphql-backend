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


const phoneFetch = ({ message, receiver }) => {
  return fetch(
    process.env.KARMA_PHONE_TO_TOPIC,
    process.env.KARMA_PHONE_FROM_TOPIC,
    {
      message,
      receiver,
      dryRun: true,
    }
  )
}


// phoneFetch({ message: "Test", receiver: "79262543421" }).then(console.log).catch(console.log)


export {
  chainFetch,
  mailerFetch,
}
