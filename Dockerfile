ARG NODE_VERSION=18-slim

# DEVELOPMENT STAGE
FROM node:${NODE_VERSION} as development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /opt/app

COPY package*.json ./

RUN yarn install --frozen-lockfile --silent --prod

COPY . .

RUN apt-get update && apt-get install gnupg wget curl bash -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash && \
  apt-get update && \
  apt-get install -y infisical && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /var/cache/apt/*

CMD ["infisical", "run", "--", "yarn", "start"]

# PRODUCTION STAGE
FROM gcr.io/distroless/nodejs18-debian11 as production

WORKDIR /opt/app

COPY --from=development /opt/app .

CMD ["index.js"]
