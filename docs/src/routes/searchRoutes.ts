import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import { logError } from "../utils/logger";
import MeiliSearch, { Index } from "meilisearch";
import { SearchAllRequest, SearchPageRequest } from "../customTypes";
dotenv.config();
const router: Router = express.Router();

// Meilisearch Setup
const MEILISEARCH_HOST: string | undefined = process.env.MEILISEARCH_HOST;
const MEILISEARCH_MASTER: string | undefined = process.env.MEILISEARCH_MASTER;
if (!MEILISEARCH_HOST || !MEILISEARCH_MASTER) throw new Error("One or more Meilisearch environment variables are missing.");
const MeiliSearchClient: MeiliSearch = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_MASTER
});

// All Pages
router.get("/all/:version/:language", async (req: Request, res: Response) => {
    try {
        // Setup
        if (!MeiliSearchClient) return;
        const searchParams = req.query as SearchAllRequest;
        if (!searchParams.limit || !searchParams.offset || !searchParams.query) return res.sendStatus(400);

        const index: Index = MeiliSearchClient.index(`documentation_${req.params.version}_${req.params.language}`);
        const search = await index.search(searchParams.query, {
            "hitsPerPage": searchParams.limit ? parseInt(searchParams.limit) : 5,
            "attributesToSearchOn": ["content", "page"],
            "offset": searchParams.offset ? parseInt(searchParams.offset) : 0
        });

        res.json({ "results": search.hits, "count": search.totalHits, "duration_ms": search.processingTimeMs, "query": searchParams.query });
    } catch (error: any) {
        const userErrorCodes: Array<string> = ["index_not_found", "invalid_search_limit"];
        if (error.toString().includes("fetch failed")) return res.sendStatus(503);
        if (!userErrorCodes.includes(error.code)) logError(error);
        return res.sendStatus(error.httpStatus || 500);
    }
});

// Specific Page
router.get("/page/:version/:language", async (req: Request, res: Response) => {
    try {
        // Setup
        if (!MeiliSearchClient) return;
        const searchParams = req.query as SearchPageRequest;
        if (!searchParams.query || !searchParams.type || !searchParams.category || !searchParams.page) return res.sendStatus(400);

        const index: Index = MeiliSearchClient.index(`documentation_${req.params.version}_${req.params.language}`);
        const search = await index.search(searchParams.query, {
            "filter": `type = '${searchParams.type}' AND category = '${searchParams.category}' AND page = '${searchParams.page}'`,
            "hitsPerPage": searchParams.limit ? parseInt(searchParams.limit) : 5,
            "attributesToSearchOn": ["content"],
            "offset": searchParams.offset ? parseInt(searchParams.offset) : 0
        });

        res.json({ "results": search.hits, "count": search.totalHits, "duration_ms": search.processingTimeMs, "query": searchParams.query });
    } catch (error: any) {
        const userErrorCodes: Array<string> = ["index_not_found", "invalid_search_limit"];
        if (error.toString().includes("fetch failed")) return res.sendStatus(503);
        if (!userErrorCodes.includes(error.code)) logError(error);
        return res.sendStatus(error.httpStatus || 500);
    }
});

export { router as SearchRoutes };