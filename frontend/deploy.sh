#!/bin/sh
export HOME=/home/SVKruik
export PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

# Git
cd ..
git config --global --add safe.directory /home/SVKruik/Documents/GitHub/SK-Platform
git reset --hard
git pull
echo "Git setup complete."

# Horizon - www.stefankruik.com
cd site
npm install
npm run build
sudo systemctl restart sk-horizon.service
echo "SK Horizon deployment complete. Reloading server."

# Platform - platform.stefankruik.com
cd ../frontend
npm install
npm run build
sudo systemctl restart sk-platform.service
echo "SK Platform deployment complete. Reloading server."
