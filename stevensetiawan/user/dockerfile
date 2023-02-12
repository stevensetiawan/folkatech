FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add tzdata && npm i -g node-gyp && npm i

COPY . .

EXPOSE 3002

CMD npm start