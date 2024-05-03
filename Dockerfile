FROM node:20 as base

LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /usr/src/app

EXPOSE 3002



FROM base as development

COPY ["package*.json", "yarn.lock", "./"]

RUN yarn install

RUN yarn add nodemon

CMD ["npx", "nodemon", "src/server.js"]



FROM base as production

COPY node_modules ./node_modules

COPY dist ./dist/

COPY src/public ./dist/public

COPY src/views ./dist/views

CMD ["node", "dist/server.js"]