#!/usr/bin/env bash

./build-prod.sh

docker-compose -f docker-compose.yml -f docker-compose.local.yml down
docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d
docker-compose -f docker-compose.yml -f docker-compose.local.yml logs -f
