import Rx from "rxjs"
import Kafka from "no-kafka"
import shortid from "shortid"
import msgpack from "msgpack"


const producer = new Kafka.Producer({
  clientId: "karma.backend",
  connectionString: process.env.KAFKA_CONNECTION,
})


const consumer = new Kafka.SimpleConsumer({
  groupId: "karma.backend",
  clientId: "karma.backend",
  connectionString: process.env.KAFKA_CONNECTION,
  maxWaitTime: 0,
  idleTimeout: 0,
})


const source = new Rx.Subject()

consumer.init().then(() => {
  consumer.subscribe(process.env.KARMA_CONSUMER_TOPIC, messages => {
    messages.forEach(({ message: { key, value }}) => {
      source.next({
        key: key.toString(),
        value: msgpack.unpack(value)
      })
    })
  })
})


const destination = new Rx.Subject()

destination.subscribe(({ key, payload }) => {
  producer.init().then(() => {
    producer.send({
      topic: process.env.KARMA_PRODUCER_TOPIC,
      message: {
        key: key,
        value: msgpack.pack(payload),
      }
    })
  })
})


export const fetch = async payload => {
  const key = shortid.generate()

  destination.next({ key, payload })

  return new Promise(resolve => {
    const subscription = source
      .filter(payload => payload.key === key)
      .subscribe(({ value }) => {
        subscription.unsubscribe()
        resolve(value)
      })
  })
}


export const graphql = payload => {
  return new Promise((resolve, reject) => {
    fetch(payload)
      .then(({ data, errors }) => {
        if (errors)
          reject(errors[0].message)
        resolve(data)
      })
  })
}
