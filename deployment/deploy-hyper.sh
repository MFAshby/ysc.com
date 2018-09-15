#!/usr/bin/env bash
# Web server config
export EXTERNAL_URL=ysc.nsupdate.info
export TLS_CONFIG=

# Build the api server
pushd ../sailraceserver
yarn
popd

# Build results component
pushd ../sailraceresults
yarn
PUBLIC_URL=https://ysc.nsupdate.info/results \
  REACT_APP_API_SERVER=https://ysc.nsupdate.info/api \
  yarn run build
popd

# Build the admin component
pushd ../sailraceadministration
yarn
PUBLIC_URL=https://ysc.nsupdate.info/admin \
  REACT_APP_API_SERVER=https://ysc.nsupdate.info/api \
  yarn run build
popd

# Copy single page apps to web server static files dir
rm -rf front/static/results
cp -r ../sailraceresults/build front/static/results
rm -rf front/static/admin
cp -r ../sailraceadministration/build front/static/admin

# rebuild all docker images & push to docker hub
docker-compose build
docker-compose push

# Pull the latest images and sync service
hyper compose pull -f hyper-compose.yml
hyper compose up -f hyper-compose.yml -d