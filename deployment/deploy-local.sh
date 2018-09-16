#!/usr/bin/env bash
# Web server config
export EXTERNAL_URL=localhost:8080
export TLS_CONFIG=off

# Build the api server
pushd ../sailraceserver
yarn
popd

# Build results component
pushd ../sailraceresults
yarn
PUBLIC_URL=http://localhost:8080/results \
  REACT_APP_API_SERVER=http://localhost:8080/api \
  yarn run build
popd

# Build the admin component
pushd ../sailraceadministration
yarn
PUBLIC_URL=http://localhost:8080/admin \
  REACT_APP_API_SERVER=http://localhost:8080/api \
  yarn run build
popd

# Copy single page apps to web server static files dir
rm -rf front/static/results
cp -r ../sailraceresults/build front/static/results
rm -rf front/static/admin
cp -r ../sailraceadministration/build front/static/admin

# Copy single page apps to wordpress as well
rm -rf wordpress/files/html/wp-content/plugins/sailraceresults/app
cp -r ../sailraceresults/build/. wordpress/files/html/wp-content/plugins/sailraceresults/app

# rebuild all docker images, re-create containers
docker-compose down
docker-compose build
docker-compose up -d

# Follow the logs so we can see what's going on
docker-compose logs -f
