import express, { Express, NextFunction, Request, Response } from "express";
import { config as configEnv } from "dotenv";
import { config as configDb } from "@svkruik/sk-platform-db-conn";
import helmet from "helmet";
import cors from "cors";
import { logData } from "@svkruik/sk-platform-formatters";
import { mountUplink } from "@svkruik/sk-uplink-connector";
import { rateLimit } from "express-rate-limit";
import { apiRequest } from "./utils/middleware";
import { SearchRoutes } from "./routes/searchRoutes";
import { VoteRoutes } from "./routes/voteRoutes";
import { DocumentationFile, FileRequest, IndexItem, RecommendedItem, UrlParams } from "./customTypes";
import { formatApiError } from "./utils/format";
import { getFile, getIndex, getRecommendedItems } from "./utils/file";

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
const validTypes: Array<string> = ["Doc", "Guide"];

/**
 * Validate url params.
 * @param version The version to check, if any.
 * @param language The language to check, if any.
 * @param type The type to check, if any.
 * @returns False if invalid and the checked url params if valid.
 */
function validateUrlParams(version?: string, language?: string, type?: string): UrlParams | false {
    if (version && !validVersions.includes(version)) return false;
    if (language && !validLanguages.includes(language)) return false;
    if (type && !validTypes.includes(type)) return false;

    return {
        "version": version ? version.replace("..", "") : "",
        "language": language ? language.replace("..", "") : "",
        "type": type ? type.replace("..", "") : ""
    };
}

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
        if (!params) return res.sendStatus(400);

        // Indices
        const docIndex: Array<IndexItem> = getIndex(params.version, params.language, "Doc");
        const guideIndex: Array<IndexItem> = getIndex(params.version, params.language, "Guide");

        // Recommended Items
        const recommendedDocItems: Array<RecommendedItem> = getRecommendedItems(params.language, "Doc");
        const recommendedGuideItems: Array<RecommendedItem> = getRecommendedItems(params.language, "Guide");

        return res.json({
            "docIndex": docIndex,
            "guideIndex": guideIndex,
            "recommendedDocItems": recommendedDocItems,
            "recommendedGuideItems": recommendedGuideItems
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
        if (!params) return res.sendStatus(400);

        const file: DocumentationFile = await getFile(searchQuery.folder, searchQuery.name, params.version, params.language, params.type, false);
        return res.json({ "file": file });
    } catch (error: any) {
        next(error);
    }
});

// Get Index
app.get("/getIndex/:version/:language/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language, req.params.type);
        if (!params) return res.sendStatus(400);

        const index: Array<IndexItem> = getIndex(params.version, params.language, params.type);
        return res.json({ "index": index });
    } catch (error: any) {
        next(error);
    }
});

// Get Recommended Items
app.get("/getRecommendedItems/:language/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: UrlParams | false = validateUrlParams(undefined, req.params.language, req.params.type);
        if (!params) return res.sendStatus(400);

        const data: Array<RecommendedItem> = getRecommendedItems(params.language, params.type);
        return res.json({ "recommendedItems": data });
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