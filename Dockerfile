FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY dist/ .

EXPOSE 3002

CMD ["node", "bundle.js"]
