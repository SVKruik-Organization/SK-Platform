#!/bin/sh
set -eu

set -a
. ./.env
set +a
mkdir -p logs exports

# Documentation - docs.stefankruik.com
npm ci --include=dev
npm run build
echo "Documentation build complete."

# Search Engine - docs.stefankruik.com/search
npm run seed -- v1 en-US w

if [ -f "exports/v1_en-US.json" ]; then
    curl --fail-with-body \
        --show-error \
        --silent \
        -X POST \
        -X POST 'https://docs.stefankruik.com/search/indexes/documentation_v1_en-US/documents?primaryKey=id' \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer $MEILISEARCH_MASTER" \
        --data-binary @exports/v1_en-US.json
    echo -e "\nSearch engine index deployment complete."
else
    echo -e "\nSearch engine indexing failed. HTML export file missing."
    exit 1
fi

if [ -d "dist" ]; then
    echo "Documentation deployment complete. Reloading server."
    sudo systemctl restart sk-docs.service
else
    echo "Documentation deployment failed. Dist directory missing."
    exit 1
fi
