import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DocumentationFile, FileRequest, FilesRequest, FolderItem, IndexItem, RecommendedItem } from "./customTypes";
import { getCategories, getDefaultFile, getFile, getFiles, getIndex, getRecommendedItems } from "./utils/file";
import { SearchRoutes } from "./routes/searchRoutes";
import { APIRoutes } from "./routes/apiRoutes";
import { apiMiddleware, log } from "./utils/logger";
import { rateLimit } from 'express-rate-limit'
dotenv.config();
const app: Express = express();
app.use(express.json());

// CORS Config
const corsOptions = {
    origin: ["http://localhost:3002", "https://bots.stefankruik.com"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(apiMiddleware);

// Placeholder Recommended Item
const placeholder: RecommendedItem = {
    "title": "None_Available",
    "anchor": "",
    "category": "",
    "id": 1,
    "page": "",
    "time": 1,
    "icon": ""
};

// Other Routes
app.use("/search", SearchRoutes);
app.use("/api", APIRoutes);

// Base Route
app.get("/", (req: Request, res: Response) => {
    res.json({ "message": "If you are looking for documentation on SK Platform, you should go here: https://bots.stefankruik.com/documentation. This subdomain only hosts the backend of the documentation." });
});

// Refresh
const refreshLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
});
app.get("/refresh/:version/:language", refreshLimit, async (req: Request, res: Response) => {
    // Indices
    const docIndex: Array<IndexItem> | number = getIndex(req.params.version, req.params.language, "Doc");
    if (typeof docIndex === "number") return res.sendStatus(docIndex);
    const guideIndex: Array<IndexItem> | number = getIndex(req.params.version, req.params.language, "Guide");
    if (typeof guideIndex === "number") return res.sendStatus(guideIndex);

    // Recommended Items
    const recommendedDocItems: Array<RecommendedItem> | number = getRecommendedItems(req.params.language, "Doc");
    if (typeof recommendedDocItems === "number") return res.sendStatus(recommendedDocItems);
    if (recommendedDocItems.length === 0) recommendedDocItems.push(placeholder);
    const recommendedGuideItems: Array<RecommendedItem> | number = getRecommendedItems(req.params.language, "Guide");
    if (typeof recommendedGuideItems === "number") return res.sendStatus(recommendedGuideItems);
    if (recommendedGuideItems.length === 0) recommendedGuideItems.push(placeholder);

    return res.json({
        "docIndex": docIndex,
        "guideIndex": guideIndex,
        "recommendedDocItems": recommendedDocItems,
        "recommendedGuideItems": recommendedGuideItems
    });
});

// Get File
app.get("/getFile/:version/:language/:type", async (req: Request, res: Response) => {
    const searchQuery: FileRequest = req.query as FileRequest;
    const file: DocumentationFile | number = getFile(searchQuery.folder, searchQuery.name, req.params.version, req.params.language, req.params.type);
    if (typeof file === "number") return res.sendStatus(file);
    return res.json({ "file": file });
});

// Get Files
app.get("/getFiles/:version/:language/:type", async (req: Request, res: Response) => {
    const searchQuery: FilesRequest = req.query as FilesRequest;
    const files: Array<string> | number = getFiles(searchQuery.folder, req.params.version, req.params.language, req.params.type);
    if (typeof files === "number") return res.sendStatus(files);
    return res.json({ "files": files });
});

// Get Category Default
app.get("/getDefault/:version/:language/:type", async (req: Request, res: Response) => {
    const searchQuery: FileRequest = req.query as FileRequest;
    const file: DocumentationFile | number = getDefaultFile(searchQuery.folder, req.params.version, req.params.language, req.params.type);
    if (typeof file === "number") return res.sendStatus(file);
    return res.json({ "file": file });
});

// Get Index
app.get("/getIndex/:version/:language/:type", async (req: Request, res: Response) => {
    const index: Array<IndexItem> | number = getIndex(req.params.version, req.params.language, req.params.type);
    if (typeof index === "number") return res.sendStatus(index);
    return res.json({ "index": index });
});

// Get Recommended Items
app.get("/getRecommendedItems/:language/:type", async (req: Request, res: Response) => {
    const data: Array<RecommendedItem> | number = getRecommendedItems(req.params.language, req.params.type);
    if (typeof data === "number") return res.sendStatus(data);
    if (data.length === 0) data.push(placeholder);
    return res.json({ "recommended_items": data });
});

// Get Categories
app.get("/getCategories/:version/:language/:type", async (req: Request, res: Response) => {
    const categories: Array<FolderItem> | number = getCategories(req.params.version, req.params.language, req.params.type);
    if (typeof categories === "number") return res.sendStatus(categories);
    return res.json({ "categories": categories });
});

// Start
const PORT: string | number = process.env.PORT || 3001;
app.listen(PORT, () => {
    log(`Documentation server listening on port ${PORT}`, "info");
});