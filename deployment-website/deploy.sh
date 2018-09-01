#!/usr/bin/env bash

# Get the latest of submodules
git submodule update --init --recursive --remote

# Build the server project
pushd sailracetimerserver
./gradlew clean build fatJar
popd

# Build the results widget
pushd sailraceresults
npm install
REACT_APP_API_SERVER="https://ysc.nsupdate.info/api" PUBLIC_URL="https://ysc.nsupdate.info/results" npm run build
popd

# Copy build products to the static web server folder
rm -rf front/static/results
cp -r sailraceresults/build front/static/results

# Build & push images to docker hub
docker-compose build
docker-compose push

# Update services on hyper
hyper compose pull -f hyper-compose.yml
hyper compose up -f hyper-compose.yml -d
