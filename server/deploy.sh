#!/bin/sh
cd ..
git reset --hard
git pull

cd frontend
npm install
npm run build
echo "Build complete"

cd ../server
npm install
rm -rf dist
mkdir -p dist
mv ../frontend/dist/* dist/
echo "Migration complete"

cd ../frontend
rm -rf dist

sudo systemctl restart bot-website.service
echo "Deployment complete. Reloaded server."
