FROM node:12-alpine

RUN mkdir /app
WORKDIR /app

COPY . /app

ENTRYPOINT node app.js 8000