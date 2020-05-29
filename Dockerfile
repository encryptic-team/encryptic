FROM node:10.12-alpine

RUN apk add --no-cache dumb-init

RUN npm install -g gulp yarn

ADD . /app

WORKDIR /app

RUN yarn

ENTRYPOINT [ "dumb-init", "--" ]

CMD [ "gulp" ]
