FROM node:21

WORKDIR /src

COPY package.json ./

RUN mkdir -p /logs && npm install

COPY . .

EXPOSE 9083