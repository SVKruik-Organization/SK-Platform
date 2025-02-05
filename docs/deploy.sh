#!/bin/sh
export HOME=/home/svkruik

# Git
cd ..
git config --global --add safe.directory "$HOME/Documents/GitHub/SK-Platform"
git reset --hard
git pull
echo "Git setup complete."

# Init
cd docs
source .env
[ -d logs ] || mkdir logs
[ -d exports ] || mkdir exports

# Search Engine - search.stefankruik.com
npm run seed v1 en-US w
cd exports

if [ -f "v1_en-US.json" ]; then
    curl \
        -X POST 'https://search.stefankruik.com/indexes/documentation_v1_en-US/documents?primaryKey=id' \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer $MEILISEARCH_MASTER" \
        --data-binary @v1_en-US.json
    echo -e "\nSearch engine index deployment complete."
else
    echo -e "\nSearch engine indexing failed. HTML export file missing."
    exit 1
fi

# Documentation - docs.stefankruik.com
cd ..
npm install
npm run build
echo "Documentation build complete."

if [ -d "dist" ]; then
    echo "Documentation deployment complete. Reloading server soon."
    sudo systemctl restart sk-docs.service
else
    echo "Documentation deployment failed. Dist directory missing."
    exit 1
fi
