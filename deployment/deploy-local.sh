#!/usr/bin/env bash
# Web server config
export EXTERNAL_URL=localhost:8080
export TLS_CONFIG=off

# Build the api server
pushd ../sailraceserver
yarn
popd

# Build common client-side code
pushd ../sailracecalculator
yarn
yarn run build
popd

# Build results component
pushd ../sailraceresults
yarn
PUBLIC_URL=http://localhost:8080/results \
  REACT_APP_API_SERVER=http://localhost:8080/api \
  yarn run build
popd

# Build the admin widget
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

# Build the results wordpress widget
pushd ../sailraceresults-plugin
yarn 
yarn run prod
popd

# Copy it to wordpress
rm -rf wordpress/files/html/wp-content/plugins/sailraceresults-plugin
cp -r ../sailraceresults-plugin wordpress/files/html/wp-content/plugins/

# rebuild all docker images, re-create containers
docker-compose down
docker-compose build
docker-compose up -d

# Follow the logs so we can see what's going on
docker-compose logs -f
