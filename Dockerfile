FROM node:20 as base

LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /usr/src/app

EXPOSE 3002



FROM base as development

RUN yarn add nodemon

CMD ["npx", "nodemon", "src/server.js"]



FROM base as production

COPY node_modules ./node_modules

COPY dist ./dist/

COPY src/public ./dist/public

COPY src/views ./dist/views

COPY src/locales ./dist/locales


CMD ["node", "dist/server.js"]