#!/usr/bin/env bash

# Build the api server
pushd ../sailraceserver
yarn
popd

# Build results component
pushd ../sailraceresults
yarn
yarn run build
popd

# Build the admin component
pushd ../sailraceadministration
yarn
yarn run build
popd

# Copy single page apps to web server static files dir
rm -rf front/static/results
cp -r ../sailraceresults/results front/static/results
rm -rf front/static/admin
cp -r ../sailraceadministration/admin front/static/admin

# Copy single page apps to wordpress as well
rm -rf wordpress/files/html/wp-content/plugins/sailraceresults/app
cp -r ../sailraceresults/build/. wordpress/files/html/wp-content/plugins/sailraceresults/app

# rebuild all docker images to embed the bits, and
docker-compose down
docker-compose build
docker-compose up -d

# Follow the logs so we can see what's going on
docker-compose logs -f
