#!/usr/bin/env bash
docker-compose pull -f docker-compose.yml -f docker-compose.prod.yml -d
docker-compose up -f docker-compose.yml -f docker-compose.prod.yml -d
docker-compose logs -f