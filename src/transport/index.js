import {
  fetch
} from "@karmared/kafka-transport"


const graphqlWithTopic = payload =>
  new Promise((resolve, reject) => {
    fetch(
      process.env.KARMA_PRODUCER_TOPIC,
      process.env.KARMA_CONSUMER_TOPIC,
      payload
    )
      .then(({ data, errors }) => {
        if (errors) return reject(errors)
        resolve(data)
      })
  })


export {
  graphqlWithTopic as graphql,
}
