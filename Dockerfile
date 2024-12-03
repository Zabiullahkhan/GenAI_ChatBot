# 1 - Base Stage
FROM node:22 as base
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# 2 - Dependencies Stage - Install all dependencies including dev
FROM base as dependencies
COPY --chown=node:node package.json package.json
RUN npm install --include=dev

# 3 - Build Stage - Build the application
FROM base AS build
COPY --from=dependencies /home/node/app/node_modules node_modules
COPY --chown=node:node . .
RUN npm run build

# 4 - Production Dependencies Stage - Only keep production dependencies
FROM dependencies AS prod-dependencies
COPY --from=dependencies /home/node/app/package.json package.json
COPY --from=dependencies /home/node/app/node_modules /home/node/app/node_modules
RUN npm prune --production

# 5 - Final Stage - Production runner image
FROM node:22-alpine
USER node
ENV NODE_ENV production
WORKDIR /home/node/app
COPY --chown=node:node --from=prod-dependencies /home/node/app/node_modules node_modules
COPY --chown=node:node --from=prod-dependencies /home/node/app/package.json package.json
COPY --chown=node:node --from=build /home/node/app/build /home/node/app/build
COPY --chown=node:node --from=build /home/node/app/public /home/node/app/public
CMD ["npm", "run", "start"]
