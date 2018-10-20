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

# Build the input component
pushd ../sailraceinput
yarn
yarn run build
popd

# Copy single page apps to web server static files dir
rm -rf front/static/results
cp -r ../sailraceresults/results front/static/results
rm -rf front/static/input
cp -r ../sailraceinput/dist front/static/input

# Copy single page apps to wordpress as well
rm -rf wordpress/files/html/wp-content/plugins/sailraceresults/results
cp -r ../sailraceresults/results/. wordpress/files/html/wp-content/plugins/sailraceresults/results
rm -rf wordpress/files/html/wp-content/plugins/sailraceresults/input
cp -r ../sailraceinput/dist/. wordpress/files/html/wp-content/plugins/sailraceresults/input

# Build the docker images (this embeds all the files in them)
docker-compose -f docker-compose.yml -f docker-compose.build.yml build