# Dockerfile
FROM node:18-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

FROM base AS release
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]