#!/bin/bash
#export PATH=/Users/svkruik/.nvm/versions/node/v20.17.0/bin:$PATH

# Frontend - platform.dev.loc
cd frontend
npm install

# Backend - docs.dev.loc
cd ../docs
npm install
mkdir -p logs

# Docker
cd ..
docker-compose up -d --build
