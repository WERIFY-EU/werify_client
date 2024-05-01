FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3002

CMD ["node", "dist/bundle.js"]

