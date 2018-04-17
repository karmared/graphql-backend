FROM node:8-alpine
WORKDIR /app
COPY . ./
RUN apk update && \
    apk add python make gcc g++ openssl openssh-client&& \
    yarn && \
    yarn build && \
    ssh-keygen -t rsa -b 2048 -f jwtRS256.key -q -N "" && \
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
CMD ["yarn", "serve"]

