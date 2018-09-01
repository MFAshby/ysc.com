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
REACT_APP_API_SERVER="http://localhost:8080/api" PUBLIC_URL="http://localhost:8080/results" npm run build
popd

# Copy build products to the static web server folder
rm -rf front/static/results
cp -r sailraceresults/build front/static/results

docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f
