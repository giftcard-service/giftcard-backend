FROM node:12.19.0-alpine3.9 AS development

WORKDIR /backend

COPY package*.json ./

RUN yarn add glob rimraf

RUN yarn install --only=development

COPY . .

RUN yarn run build


FROM node:12.19.0-alpine3.9 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /backend

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /backend/build ./build

CMD ["node", "build/main"]
