import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { FileRequest, FilesRequest, FolderItem, IndexItem, RecommendedItem } from "./customTypes";
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

// Logging
app.get("*", apiMiddleware);
app.post("*", apiMiddleware);
app.put("*", apiMiddleware);
app.delete("*", apiMiddleware);

// Other Routes
app.use("/search", SearchRoutes);
app.use("/api", APIRoutes);

// Base Route
app.get("/", (req: Request, res: Response) => {
    res.json({ "message": "Default Documentation Endpoint" });
});

// Get File
app.get("/getFile/:version/:language", async (req: Request, res: Response) => {
    const searchQuery: FileRequest = req.query as FileRequest;
    const file: string | number = getFile(searchQuery.folder, searchQuery.name, req.params.version, req.params.language);
    if (typeof file === "number") return res.sendStatus(file);
    return res.json({ "file": file });
});

// Get Files
app.get("/getFiles/:version/:language", async (req: Request, res: Response) => {
    const searchQuery: FilesRequest = req.query as FilesRequest;
    const files: Array<string> | number = getFiles(searchQuery.folder, req.params.version, req.params.language);
    if (typeof files === "number") return res.sendStatus(files);
    return res.json({ "files": files });
});

// Get Category Default
app.get("/getDefault/:version/:language", async (req: Request, res: Response) => {
    const searchQuery: FileRequest = req.query as FileRequest;
    const file: string | number = getDefaultFile(searchQuery.folder, req.params.version, req.params.language);
    if (typeof file === "number") return res.sendStatus(file);
    return res.json({ "file": file });
});

// Get Index
const rateLimit2 = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 1,
    standardHeaders: true,
    legacyHeaders: false
});
app.get("/getIndex/:version/:language", rateLimit2, async (req: Request, res: Response) => {
    const index: Array<IndexItem> | number = getIndex(req.params.version, req.params.language);
    if (typeof index === "number") return res.sendStatus(index);
    return res.json({ "index": index });
});

// Get Recommended Items
app.get("/getRecommendedItems/:language", rateLimit2, async (req: Request, res: Response) => {
    const data: Array<RecommendedItem> | number = getRecommendedItems(req.params.language);
    if (typeof data === "number") return res.sendStatus(data);
    return res.json({ "recommended_items": data });
});

// Get Categories
app.get("/getCategories/:version/:language", async (req: Request, res: Response) => {
    const categories: Array<FolderItem> | number = getCategories(req.params.version, req.params.language);
    if (typeof categories === "number") return res.sendStatus(categories);
    return res.json({ "categories": categories });
});

// Start
const PORT: string | number = process.env.PORT || 3001;
app.listen(PORT, () => {
    log(`Documentation server listening on port ${PORT}`, "info");
});