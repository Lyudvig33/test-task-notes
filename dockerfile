###################
# DEVELOPMENT BUILD
###################

FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install 

COPY . .

RUN npm run build

###################
# PRODUCTION BUILD
###################

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
