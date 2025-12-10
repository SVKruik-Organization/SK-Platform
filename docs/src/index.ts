import express, { Express, NextFunction, Request, Response } from "express";
import { config as configEnv } from "dotenv";
import { config as configDb } from "@svkruik/sk-platform-db-conn";
import helmet from "helmet";
import cors from "cors";
import { logData } from "@svkruik/sk-platform-formatters";
import { mountUplink } from "@svkruik/sk-uplink-connector";
import { rateLimit } from "express-rate-limit";
import { apiRequest, protectedApiRequest } from "./utils/middleware";
import { SearchRoutes } from "./routes/searchRoutes";
import { VoteRoutes } from "./routes/voteRoutes";
import { DocumentationFile, FileRequest, IndexItem, FeaturedItem, UrlParams, ValidCacheTypes, DocumentationTypes } from "./customTypes";
import { formatApiError } from "./utils/format";
import { getFeaturedItems } from "./utils/file";
import { clearCache, getCachedFile, getCacheDetails, getCachedIndex } from "./utils/cache";

configEnv();
configDb({
    "databaseHost": process.env.DATABASE_HOST as string,
    "databasePort": process.env.DATABASE_PORT as string,
    "databaseUsername": process.env.DATABASE_USERNAME as string,
    "databasePassword": process.env.DATABASE_PASSWORD as string
});

// CORS Config
if (!process.env.CORS) throw new Error("Missing CORS configuration.");
const corsOptions = {
    origin: process.env.CORS.split(","),
    optionsSuccessStatus: 200
}

// App Config
const app: Express = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(apiRequest);
app.use("/search", SearchRoutes);
app.use("/votes", VoteRoutes);
app.enable("trust proxy");
app.set("trust proxy", 1);
app.use(helmet());

// Base Route
app.get("/", (_req: Request, res: Response) => {
    res.redirect(308, "https://platform.stefankruik.com/documentation");
});

// Status Shield
app.get("/api/status/badge", (_req: Request, res: Response) => {
    res.json({ "schemaVersion": 1, "label": "SK Docs Status", "message": "online", "color": "brightgreen" });
});

// Valid Url Params
const validVersions: Array<string> = ["v1"];
const validLanguages: Array<string> = ["en-US"];

/**
 * Validate url params.
 * 
 * @param version The version to check, if any.
 * @param language The language to check, if any.
 * @param type The type to check, if any.
 * @returns False if invalid and the checked url params if valid.
 */
function validateUrlParams(version?: string, language?: string, type?: string): UrlParams | false {
    if (version && !validVersions.includes(version)) return false;
    if (language && !validLanguages.includes(language)) return false;
    if (type && !(type.toUpperCase() in DocumentationTypes)) return false;

    return {
        "version": version || "",
        "language": language || "",
        "type": type as DocumentationTypes || DocumentationTypes.DOC
    };
}

/** 
 * Validate cache url params.
 *
 * @param type The type to check, if any.
 * @returns False if invalid and the checked type if valid.
 */
function validateCacheUrlParams(type: string | null): ValidCacheTypes | false {
    if (!type || !(type.toUpperCase() in ValidCacheTypes)) return false;
    return ValidCacheTypes[type.toUpperCase() as keyof typeof ValidCacheTypes];
}

// From here it is protected
app.use(protectedApiRequest);

// Refresh
const refreshLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false
});
app.get("/refresh/:version/:language", refreshLimit, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language);
        if (!params) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        // Indices
        const docIndex: Array<IndexItem> = getCachedIndex(params.version, params.language, DocumentationTypes.DOC);
        const guideIndex: Array<IndexItem> = getCachedIndex(params.version, params.language, DocumentationTypes.GUIDE);

        // Featured Items
        const featuredDocItems: Array<FeaturedItem> = getFeaturedItems(params.language, DocumentationTypes.DOC);
        const featuredGuideItems: Array<FeaturedItem> = getFeaturedItems(params.language, DocumentationTypes.GUIDE);

        return res.json({
            "docIndex": docIndex,
            "guideIndex": guideIndex,
            "featuredDocItems": featuredDocItems,
            "featuredGuideItems": featuredGuideItems
        });
    } catch (error: any) {
        next(error);
    }
});

// Get File
app.get("/getFile/:version/:language/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchQuery: FileRequest = req.query as FileRequest;
        const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language, req.params.type);
        if (!params) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        // TODO: Refresh should not update view count
        const file: DocumentationFile = await getCachedFile({
            "folder": searchQuery.folder,
            "name": searchQuery.name,
            "version": params.version,
            "language": params.language,
            "type": params.type
        });
        return res.json(file);
    } catch (error: any) {
        next(error);
    }
});

// Get Index
app.get("/getIndex/:version/:language/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language, req.params.type);
        if (!params) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        const index: Array<IndexItem> = getCachedIndex(params.version, params.language, params.type);
        return res.json(index);
    } catch (error: any) {
        next(error);
    }
});

// Get Featured Items
app.get("/getFeaturedItems/:language/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: UrlParams | false = validateUrlParams(undefined, req.params.language, req.params.type);
        if (!params) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        const data: Array<FeaturedItem> = getFeaturedItems(params.language, params.type);
        return res.json(data);
    } catch (error: any) {
        next(error);
    }
});

// Documentation Page Cache Details
app.get("/cache/:type", (req: Request, res: Response, next: NextFunction) => {
    try {
        const type: ValidCacheTypes | false = validateCacheUrlParams(req.params.type || null);
        if (!type) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        return res.json(getCacheDetails(type));
    } catch (error: any) {
        next(error);
    }
});

// Clear Documentation Page Cache
app.delete("/cache/:type", (req: Request, res: Response, next: NextFunction) => {
    try {
        const type: ValidCacheTypes | false = validateCacheUrlParams(req.params.type || null);
        if (!type) throw new Error("Invalid / missing URL params.", { cause: { statusCode: 1400 } });

        clearCache(type);
        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }
});

// Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const { statusCode, message } = formatApiError(err);
    res.status(statusCode).json({ message });
});

// Start
const PORT: number = parseInt(process.env.PORT as string) || 3002;
app.listen(PORT, async () => {
    await mountUplink();
    logData(`Documentation server listening on port ${PORT}`, "info");
});