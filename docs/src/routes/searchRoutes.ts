import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import { logError } from "../utils/logger";
import MeiliSearch, { Index } from "meilisearch";
import { SearchRequest } from "../customTypes";
dotenv.config();
const router: Router = express.Router();

// Meilisearch Setup
const MEILISEARCH_HOST: string | undefined = process.env.MEILISEARCH_HOST;
const MEILISEARCH_MASTER: string | undefined = process.env.MEILISEARCH_MASTER;
if (!MEILISEARCH_HOST || !MEILISEARCH_MASTER) process.exit(1);
const MeiliSearchClient: MeiliSearch = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_MASTER
});

// Base Route
router.get("/", function (req: Request, res: Response) {
    res.json({ "message": "Default Search Endpoint" });
});

// All Pages
router.get("/all/:version/:language", async (req: Request, res: Response) => {
    try {
        // Setup
        if (!MeiliSearchClient) return;
        const searchParams = req.query as SearchRequest;
        if (!searchParams.index || !searchParams.query) return res.sendStatus(400);

        const index: Index = MeiliSearchClient.index(searchParams.index);
        const search = await index.search(searchParams.query, {
            "limit": searchParams.limit ? parseInt(searchParams.limit) : 5,
        });
        res.json({ "result": search.hits, "count": search.hits.length });
    } catch (error: any) {
        const userErrorCodes: Array<string> = ["index_not_found", "invalid_search_limit"];
        if (!userErrorCodes.includes(error.code)) logError(error);
        return res.sendStatus(error.httpStatus || 500);
    }
});

// Specific Page
router.get("/page/:version/:language", async (req: Request, res: Response) => {
    const searchParams = req.query as SearchRequest;
    console.log(searchParams);
    res.json({ "result": "Search Page Endpoint", "count": 0 });
});

export { router as SearchRoutes };