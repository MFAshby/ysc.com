#!/usr/bin/env bash
./build-prod.sh && docker-compose -f docker-compose.yml -f docker-compose.build.yml push