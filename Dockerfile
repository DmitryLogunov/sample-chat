FROM node:8-alpine

WORKDIR /usr/src/app

COPY . .

CMD [ "node", "./bin/index.js" ]


