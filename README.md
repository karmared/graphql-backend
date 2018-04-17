# graphql-backend


### Environment
```
PORT=40001

RETHINKDB_CONNECTION=[[rethinkdb://][user[:password]@][host[:port][/db]]]

KAFKA_CONNECTION=[host[:port]]

KAFKA_GROUP_ID=karma.backend
KAFKA_CLIENT_ID=karma.backend

KARMA_BACKEND_TO_TOPIC=karma.app.to.backend
KARMA_BACKEND_FROM_TOPIC=karma.app.from.backend

KARMA_MAIL_TO_TOPIC=karma.app.to.mailer
KARMA_MAIL_FROM_TOPIC=karma.app.from.mailer
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
yarn migrate
```


### Start
```sh
yarn serve
```
