#!/usr/bin/env bash

# Build the api server
pushd ../sailraceserver
yarn
popd

# results component
pushd ../sailraceresults
yarn
yarn run watch&
popd

# Build the series results component
pushd ../sailraceseries
yarn
yarn run watch&
popd

# Build the admin component
pushd ../sailraceinput
yarn
yarn run watch&
popd

# Drop & re-create containers
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.yml -f docker-compose.local.yml -f docker-compose.dev.yml up

# Kill all the yarns once we've done
killall node
