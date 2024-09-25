#!/bin/sh
export HOME=/home/SVKruik
export PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

# Git
cd ..
git config --global --add safe.directory /home/SVKruik/Documents/GitHub/SK-Platform
git reset --hard
git pull
echo "Git setup complete"

# Hosting - platform.stefankruik.com
cd frontend-nuxt
npm install
npm run build
sudo systemctl restart sk-platform.service
echo "Hosting deployment complete. Reloading server."
