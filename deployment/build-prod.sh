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

# Build series component
pushd ../sailraceseries
yarn
yarn run build
popd

# Build the input component
pushd ../sailraceinput
yarn
yarn run build
popd

# Copy single page apps to wordpress
rm -rf wordpress/dist/sailraceresults/
mkdir -p wordpress/dist/sailraceresults/
cp -r ../sailraceresults/dist/. wordpress/dist/sailraceresults/results
cp -r ../sailraceinput/dist/. wordpress/dist/sailraceresults/input
cp -r ../sailraceseries/dist/. wordpress/dist/sailraceresults/series
cp wordpress/sailraceresults.php wordpress/dist/sailraceresults/

# Build the docker images (this embeds all the files in them)
docker-compose -f docker-compose.yml -f docker-compose.build.yml build