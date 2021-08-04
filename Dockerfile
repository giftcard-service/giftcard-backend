FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /server

# Install all packages
COPY package.json yarn.lock ./
RUN yarn install --production=false

# Transpile TypeScript into JavaScript
COPY src src
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
RUN yarn build

# Remove useless files
RUN rm -rf node_modules src tsconfig.json tsconfig.build.json

# Install only dependency packages 
RUN yarn install

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]

CMD [ "start:prod" ]

# FROM node:12.19.0-alpine3.9 AS development

# WORKDIR /server

# COPY package.json yarn.lock ./

# RUN yarn add glob rimraf

# RUN yarn install --only=development

# COPY . .

# RUN yarn build


# FROM node:lts-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /server

# COPY package*.json ./

# RUN yarn install --only=production

# COPY . .

# COPY --from=development /backend/build ./build

# CMD ["node", "build/main"]
