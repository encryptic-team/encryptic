FROM node:10.12-alpine

RUN npm install -g gulp yarn

ADD . /app

WORKDIR /app

RUN yarn

CMD [ "gulp" ]
