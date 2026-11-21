#!/bin/sh
export HOME=/home/svkruik
set -eu

# Git
cd ..
git config --global --add safe.directory "$HOME/Documents/GitHub/SK-Platform"
git reset --hard
git pull
echo "Git setup complete."

# Horizon - www.stefankruik.com
cd site
npm install
npm run build
echo "SK Horizon deployment complete. Reloading server."
sudo systemctl restart sk-horizon.service

# Docs - docs.stefankruik.com
cd ../docs
sh deploy.sh

# Platform - platform.stefankruik.com
cd ../frontend
npm install
npm run build
echo "SK Platform deployment complete. Reloading server."
sudo systemctl restart sk-platform.service
