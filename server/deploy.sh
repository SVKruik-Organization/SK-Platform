#!/bin/sh
export HOME=/home/SVKruik
export PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

# Git
cd ..
git config --global --add safe.directory /home/SVKruik/Documents/GitHub/Bot-Website
git reset --hard
git pull
echo "Git setup complete"

# Hosting - bots.stefankruik.com
cd frontend
npm install
npm run build
echo "Hosting build complete"

if [ -d "dist" ]; then
    cd ../server
    npm install
    rm -rf dist
    mkdir -p dist
    mv ../frontend/dist/* dist/
    echo "Migration complete"

    cd ../frontend
    rm -rf dist
    echo "Cleanup complete"
    echo "Hosting deployment complete. Reloading server soon."
else
    echo "Hosting deployment failed. Dist directory missing."
    exit 1
fi

# Documentation - docs.stefankruik.com
cd ../docs
npm install
npm run build
echo "Documentation build complete"

if [ -d "dist" ]; then
    echo "Documentation deployment complete. Reloading server soon."
else
    echo "Documentation deployment failed. Dist directory missing."
    exit 1
fi

sudo systemctl restart docs-website.service
sudo systemctl restart bot-website.service
