# FROM node:18-alpine as builder
FROM node:18-slim

WORKDIR /opt/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN yarn install --frozen-lockfile --silent

COPY . .

RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# FROM gcr.io/distroless/nodejs18-debian11

# COPY --from=builder /opt/app /opt/app

# WORKDIR /opt/app

CMD [ "index.js" ]
