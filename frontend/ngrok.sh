#!/bin/bash

# Run `npm run dev` first. Then run this script to expose the local server to the internet.

source .env.local
ngrok http --domain="$NGROK_DOMAIN" http://localhost:9082
