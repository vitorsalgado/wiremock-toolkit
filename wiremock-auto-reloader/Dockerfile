FROM node:6.11.0

WORKDIR /wiremock

COPY package.json yarn.lock .

RUN yarn --production

COPY . .

CMD npm start
