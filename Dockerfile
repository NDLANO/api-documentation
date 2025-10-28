FROM node:22.21.0-alpine3.21 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

FROM node:22.21.0-alpine3.21 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:22.21.0-alpine3.21 AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Copy production dependencies & built artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Static assets (served directly)
COPY /src/static ./dist/static
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
