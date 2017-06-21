#!/bin/bash

export WIREMOCK_HOST=localhost
export WIMORECK_PORT=3000
export WIREMOCK_DATA=../wiremock/data

cd wiremock-auto-reloader
npm install --production
npm start &

cd ../wiremock
java -jar wiremock.jar --root-dir data --port=3000 --verbose