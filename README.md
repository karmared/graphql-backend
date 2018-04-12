# graphql-backend


### Environment
```
PORT=40001
KAFKA_CONNECTION=localhost:9092
KAFKA_GROUP_ID=karma.backend
KAFKA_CLIENT_ID=karma.backend
KARMA_PRODUCER_TOPIC=karma.app.from.backend
KARMA_CONSUMER_TOPIC=karma.app.to.backend
```
Consumed from `.env` file or|and environment variables. Environment variables take precedence.


### Files
```
jwtRS256.key
jwtRS256.key.pub
```

#### How to generate
```sh
ssh-keygen -t rsa -b 2048 -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```


### Install
```sh
yarn
yarn build
```


### Start
```sh
yarn serve
```
