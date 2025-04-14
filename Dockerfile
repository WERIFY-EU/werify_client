FROM node:20 AS base

LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /usr/src/app

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*


COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3002

# Stage: Development
FROM base AS development

RUN yarn add nodemon
CMD ["npx", "nodemon", "src/server.js"]

# Stage: Production
FROM base AS production

WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/src/public ./dist/public
COPY --from=base /usr/src/app/src/views ./dist/views
COPY --from=base /usr/src/app/src/locales ./dist/locales
CMD ["node", "dist/server.js"]
