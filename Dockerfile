FROM node:16.14.0 as build-stage
WORKDIR /app

COPY package*.json ./
COPY quasar.config.js ./
COPY ./ ./

RUN npm install -g npm@9.8.1
RUN npm install
RUN npm install -g @vue/cli
RUN npm install -g @quasar/cli
RUN quasar build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
