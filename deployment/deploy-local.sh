#!/usr/bin/env bash

# Web server config
export EXTERNAL_URL=localhost:8080
export TLS_CONFIG=off

# Results widget config
export REACT_APP_API_SERVER=http://localhost:8080/api
export PUBLIC_URL=http://localhost:8080/results

# Build the api server
pushd ../sailraceserver
yarn
popd

# Build results widget
pushd ../sailraceresults
yarn
yarn run build
popd

# Copy single page apps to web server static files dir
rm -rf front/static/results
cp -r ../sailraceresults/build front/static/results

# rebuild all docker images, re-create containers
docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f
