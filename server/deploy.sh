#!/bin/sh
cd ..
git config --global --add safe.directory /home/SVKruik/Documents/GitHub/Bot-Website
git reset --hard
git pull

cd frontend
/root/.nvm/versions/node/v20.11.1/bin/npm install
/root/.nvm/versions/node/v20.11.1/bin/npm run build
echo "Build complete"

cd ../server
/root/.nvm/versions/node/v20.11.1/bin/npm install
rm -rf dist
mkdir -p dist
mv ../frontend/dist/* dist/
echo "Migration complete"

cd ../frontend
rm -rf dist

sudo systemctl restart bot-website.service
echo "Deployment complete. Reloaded server."
