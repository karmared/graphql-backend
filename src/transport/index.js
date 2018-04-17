import {
  fetch
} from "@karmared/kafka-transport"


const mailerFetch = payload => {
  return fetch(
    process.env.KARMA_MAIL_TO_TOPIC,
    process.env.KARMA_MAIL_FROM_TOPIC,
    payload
  )
}


export {
  mailerFetch,
}
