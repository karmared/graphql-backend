import "/env"
import Kafka from "node-rdkafka"


const consumer = new Kafka.KafkaConsumer({
  "debug": "all",
  "metadata.broker.list": process.env.KAFKA_CONNECTION,
  "group.id": "kafka",
})


consumer.on("event.log", console.log)


consumer.on("event.error", console.error)


consumer.on("ready", arg => {
  console.log("Consumer ready", arg)

  consumer.subscribe([
    process.env.KARMA_PRODUCER_TOPIC
  ])

  consumer.consume()
})


consumer.on("data", console.log)


consumer.connect()
