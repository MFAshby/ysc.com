#!/usr/bin/env bash

wget https://rawgit.com/MFAshby/ysc.com/master/deployment/docker-compose.yml
wget https://rawgit.com/MFAshby/ysc.com/master/deployment/docker-compose.prod.yml
docker-compose up -f docker-compose.yml -f docker-compose.prod.yml -d
docker-compose logs -f