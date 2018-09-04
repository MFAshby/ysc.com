#!/usr/bin/env bash
# Server config
export DB_HOST=db
export DB_PORT=3306
export DB_DATABASE=yxsecnyo_ysc
export DB_USER=root
export DB_PASSWORD=example

# Client config
export REACT_APP_API_SERVER="http://localhost:8080/api"
export PUBLIC_URL="http://localhost:8080/results"

# Install the server node_modules
pushd ../sailraceserver
yarn
popd

# Install results widget node_modules & build it
pushd ../sailraceresults
yarn
yarn run build
popd

# Copy results widget to the static web server folder
rm -rf front/static/results
cp -r ../sailraceresults/build front/static/results

# rebuild all docker images, re-create containers
docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f
