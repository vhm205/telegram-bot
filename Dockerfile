FROM node:18-alpine as builder

WORKDIR /opt/app

COPY package*.json ./

RUN yarn install --frozen-lockfile --silent

COPY . .

RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

FROM gcr.io/distroless/nodejs18-debian11

COPY --from=builder /opt/app /opt/app

WORKDIR /opt/app
CMD [ "index.js" ]
