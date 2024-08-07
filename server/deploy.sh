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
cd frontend
npm install --omit=dev
npm run build
echo "Hosting build complete"

if [ -d "dist" ]; then
    cd ../server
    npm install --omit=dev
    npm run build
    rm -rf frontendDist
    mkdir -p frontendDist
    mv ../frontend/dist/* frontendDist/
    echo "Migration complete"

    cd ../frontend
    rm -rf dist
    echo "Cleanup complete"

    echo "Hosting deployment complete. Reloading server."
    sudo systemctl restart sk-platform.service
else
    echo "Hosting deployment failed. Dist directory missing."
    exit 1
fi
