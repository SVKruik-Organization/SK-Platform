import express, { Request, Response, Router } from "express";
import { Index } from "meilisearch";
import { SearchAllRequest, SearchPageRequest } from "../customTypes";
import rateLimit from "express-rate-limit";
import { logError } from "@svkruik/sk-platform-formatters";
import { getSearchEngine } from "../utils/networking";
const router: Router = express.Router();

// Global & Titles
const searchLimit = rateLimit({
    windowMs: 900,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false
});
router.get("/all/:version/:language", searchLimit, async (req: Request, res: Response) => {
    try {
        // Setup
        const searchEngine = getSearchEngine();
        if (!searchEngine) return res.sendStatus(503);
        const searchParams = req.query as SearchAllRequest;
        if (!searchParams.limit || !searchParams.offset || !searchParams.query || !searchParams.scope) return res.sendStatus(400);

        // Scope
        let validScopes: Array<string> = ["global", "titles"];
        if (!validScopes.includes(searchParams.scope)) return res.sendStatus(400);
        let scope: Array<string> = [];
        if (searchParams.scope === "global") {
            scope = ["content", "page"];
        } else if (searchParams.scope === "titles") scope = ["page"];

        // Search
        const offset: number = searchParams.offset ? parseInt(searchParams.offset) : 0;
        const index: Index = searchEngine.index(`documentation_${req.params.version}_${req.params.language}`);
        const search = await index.search(searchParams.query, {
            "limit": searchParams.limit ? parseInt(searchParams.limit) : 5,
            "attributesToSearchOn": scope,
            "offset": offset
        });

        // Return
        return res.json({ "results": search.hits, "count": search.estimatedTotalHits, "durationMs": search.processingTimeMs, "query": searchParams.query, "offset": offset });
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
        const searchEngine = getSearchEngine();
        if (!searchEngine) return res.sendStatus(503);
        const searchParams = req.query as SearchPageRequest;
        if (!searchParams.query || !searchParams.type || !searchParams.category || !searchParams.page) return res.sendStatus(400);

        // Search
        const offset: number = searchParams.offset ? parseInt(searchParams.offset) : 0;
        const index: Index = searchEngine.index(`documentation_${req.params.version}_${req.params.language}`);
        const search = await index.search(searchParams.query, {
            "filter": `type = '${searchParams.type}' AND category = '${searchParams.category}' AND page = '${searchParams.page}'`,
            "limit": searchParams.limit ? parseInt(searchParams.limit) : 5,
            "attributesToSearchOn": ["content"],
            "offset": offset
        });

        // Return
        return res.json({ "results": search.hits, "count": search.estimatedTotalHits, "durationMs": search.processingTimeMs, "query": searchParams.query, "offset": offset });
    } catch (error: any) {
        const userErrorCodes: Array<string> = ["index_not_found", "invalid_search_limit"];
        if (error.toString().includes("fetch failed")) return res.sendStatus(503);
        if (!userErrorCodes.includes(error.code)) logError(error);
        return res.sendStatus(error.httpStatus || 500);
    }
});

export { router as SearchRoutes };