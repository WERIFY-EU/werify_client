FROM node:20 as base
LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /usr/src/app

EXPOSE 3002

CMD ["node", "dist/server.js"]


FROM base as local

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

COPY src/public ./dist/public
COPY src/views ./dist/views


FROM base as github

COPY node_modules ./
COPY dist ./dist/
COPY src/public ./dist/public
COPY src/views ./dist/views
