#!/bin/sh
export HOME=/home/svkruik
export PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

# Git
cd ..
# git config --global --add safe.directory /home/svkruik/Documents/GitHub/Bot-Website
# git reset --hard
# git pull
# echo "Git setup complete"

# Documentation - docs.stefankruik.com
cd docs
npm install
npm run build
echo "Documentation build complete"

if [ -d "dist" ]; then
    echo "Documentation deployment complete. Reloading server soon."
    sudo systemctl restart docs-website.service
else
    echo "Documentation deployment failed. Dist directory missing."
    exit 1
fi
