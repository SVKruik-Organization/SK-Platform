#!/bin/bash
export HOME=/home/svkruik
export PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

# Git
cd ..
git config --global --add safe.directory /home/svkruik/Documents/GitHub/Bot-Website
git reset --hard
git pull
echo "Git setup complete."

# Init
cd docs
source .env
[ -d logs ] || mkdir logs
npm install

# Search Engine - search.stefankruik.com
npm run seed v1 en-US w
[ -d exports ] || mkdir exports
cd exports

if [ -f "v1_en-US.json" ]; then
    curl \
        -X POST 'https://search.stefankruik.com/indexes/documentation_v1_en-US/documents?primaryKey=id' \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer $MEILISEARCH_MASTER" \
        --data-binary @v1_en-US.json
    echo "Search engine index deployment complete."
else
    echo "Search engine indexing failed. HTML export file missing."
    exit 1
fi

# Documentation - docs.stefankruik.com
cd ..
npm run build
echo "Documentation build complete"

if [ -d "dist" ]; then
    echo "Documentation deployment complete. Reloading server soon."
    sudo systemctl restart docs-website.service
else
    echo "Documentation deployment failed. Dist directory missing."
    exit 1
fi
