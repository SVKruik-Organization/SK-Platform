import { DocumentationPageCacheEntry, DocumentationIndexCacheEntry, DocumentationFile, IndexItem, ValidCacheTypes, DocumentationTypes } from "../customTypes";
import { getFile, getIndex } from "./file";

const DOCUMENTATION_PAGE_COUNT = 97; // find . -type f -name "*.html" | wc -l
const DOCUMENTATION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Pages
const DOCUMENTATION_PAGE_CACHE = new Map<string, DocumentationPageCacheEntry>();
let lastPageCacheWrite: Date | null = null;

// Indices
let DOCUMENTATION_INDEX_CACHE = new Map<string, DocumentationIndexCacheEntry>();
let lastIndexCacheWrite: Date | null = null;

/**
 * Returns a cached documentation file or fetches it if not cached or expired.
 * 
 * @param filter The search query options.
 * @returns The cached or newly fetched file.
 */
export async function getCachedFile(filter: {
    folder: string,
    name: string,
    version: string,
    language: string,
    type: DocumentationTypes
}): Promise<DocumentationFile> {
    const key: string = `${filter.version}-${filter.language}-${filter.type}-${filter.folder}-${filter.name}`;
    const entry: DocumentationPageCacheEntry | undefined = DOCUMENTATION_PAGE_CACHE.get(key);

    if (entry && (Date.now() - entry.timestamp) < DOCUMENTATION_CACHE_TTL) {
        return entry.file;
    } else {
        const file: DocumentationFile = await getFile(filter.folder, filter.name, filter.version, filter.language, filter.type, true);
        DOCUMENTATION_PAGE_CACHE.set(key, { file, timestamp: Date.now() });

        lastPageCacheWrite = new Date();
        return file;
    }
}

/**
 * Returns a cached documentation index or fetches it if not cached or expired.
 * 
 * @param version The documentation version.
 * @param language The documentation language.
 * @param type The documentation type.
 * @returns The cached or newly fetched index.
 */
export function getCachedIndex(version: string, language: string, type: DocumentationTypes): Array<IndexItem> {
    const key: string = `${version}-${language}-${type}`;
    const entry: DocumentationIndexCacheEntry | undefined = DOCUMENTATION_INDEX_CACHE.get(key);

    if (entry && (Date.now() - entry.timestamp) < DOCUMENTATION_CACHE_TTL) {
        return entry.index;
    } else {
        const index: Array<IndexItem> = getIndex(version, language, type);
        DOCUMENTATION_INDEX_CACHE.set(key, { index, timestamp: Date.now() });

        lastIndexCacheWrite = new Date();
        return index;
    }
}

/**
 * Resets the file cache by clearing all cached entries.
 * 
 * @param type The type of cache to clear.
 */
export function clearCache(type: ValidCacheTypes): void {
    if (type === ValidCacheTypes.PAGES || type === ValidCacheTypes.ALL) {
        DOCUMENTATION_PAGE_CACHE.clear();
    } else if (type === ValidCacheTypes.INDICES || type === ValidCacheTypes.ALL) {
        DOCUMENTATION_INDEX_CACHE.clear();
    }
}

/**
 * Returns details about the current state of the file cache.
 * 
 * @param type The type of cache to get details for.
 * @returns An object containing the size of the cache and the timestamp of the last addition.
 */
export function getCacheDetails(type: ValidCacheTypes): any {
    const getPercentage = (size: number): number =>
        parseFloat(((size / DOCUMENTATION_PAGE_COUNT) * 100).toFixed(2));

    if (type === ValidCacheTypes.PAGES) {
        const size: number = DOCUMENTATION_PAGE_CACHE.size;
        return {
            "size": size,
            "percentage_cached": getPercentage(size),
            "last_addition": lastPageCacheWrite
        };
    } else if (type === ValidCacheTypes.INDICES) {
        const size: number = DOCUMENTATION_INDEX_CACHE.size;
        return {
            "size": size,
            "last_addition": lastIndexCacheWrite
        };
    } else {
        return {
            "pages": getCacheDetails(ValidCacheTypes.PAGES),
            "indices": getCacheDetails(ValidCacheTypes.INDICES)
        }
    }
}