#!/usr/bin/env bash
docker-compose up -f docker-compose.yml -f docker-compose.prod.yml -d
docker-compose logs -f