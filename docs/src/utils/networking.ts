import MeiliSearch from "meilisearch";

/**
 * Get Meilisearch client instance.
 * 
 * @returns Meilisearch client.
 * @throws Error if environment variables are missing.
 */
export function getSearchEngine(): MeiliSearch {
    const MEILISEARCH_HOST: string | undefined = process.env.MEILISEARCH_HOST;
    const MEILISEARCH_MASTER: string | undefined = process.env.MEILISEARCH_MASTER;

    if (!MEILISEARCH_HOST || !MEILISEARCH_MASTER) throw new Error("One or more Meilisearch environment variables are missing.");
    return new MeiliSearch({
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_MASTER
    });
}