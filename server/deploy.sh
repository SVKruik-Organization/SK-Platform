#!/bin/sh
cd ../frontend
npm run build
echo "Build complete"
cd ../server
rm -rf dist
mkdir -p dist
mv ../frontend/dist/* dist/
echo "Dist deployment complete. Reloading server."
