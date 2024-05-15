FROM node:20 as base

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

EXPOSE 3002



FROM base as development

RUN yarn add nodemon

CMD ["npx", "nodemon", "src/server.js"]



FROM base as production

COPY node_modules ./node_modules

COPY dist ./dist/

COPY src/public ./dist/public

COPY src/views ./dist/views

CMD ["node", "dist/server.js"]