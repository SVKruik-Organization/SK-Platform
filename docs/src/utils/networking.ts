import { logError } from '@svkruik/sk-platform-formatters';
import mariadb, { Pool } from 'mariadb';
import MeiliSearch from 'meilisearch';

declare global {
    var __db_pools__: Record<string, Pool> | undefined;
}

/**
 * Creates or returns a connection to the database using the runtime configuration.
 * 
 * @returns The database connection pool.
 * @throws If there is an issue connecting to the database.
 */
export async function database(profile: "bots"): Promise<Pool> {
    try {
        // Init and check cache container
        if (!globalThis.__db_pools__) globalThis.__db_pools__ = {};
        if (globalThis.__db_pools__[profile]) return globalThis.__db_pools__[profile];

        const pool = mariadb.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string),
            database: profile,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            multipleStatements: true,
            connectionLimit: 10,
        });

        globalThis.__db_pools__[profile] = pool;
        return pool;
    } catch (error: any) {
        logError(error);
        throw new Error("Something went wrong while connecting to the database.");
    }
}

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