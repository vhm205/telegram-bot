FROM node:18-slim

WORKDIR /opt/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package*.json ./

RUN yarn install --frozen-lockfile --silent

COPY . .

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget curl bash -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
&& apt-get update && apt-get install -y infisical

RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# FROM gcr.io/distroless/nodejs18-debian11

# COPY --from=builder /opt/app /opt/app

# WORKDIR /opt/app

CMD ["infisical", "run", "--", "npm", "run", "start"]
