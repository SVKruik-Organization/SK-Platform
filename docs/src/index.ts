import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import { FileRequest, FilesRequest, FolderItem, IndexItem } from "./customTypes";
import { getFile, getFiles, getFolderIcon } from "./utils/file";
import { SearchRoutes } from "./routes/searchRoutes";
import { APIRoutes } from "./routes/apiRoutes";
import { apiMiddleware, log, logError } from "./utils/logger";
dotenv.config();
const app: Express = express();
app.use(express.json());

// Variables
const PORT: string | number = process.env.PORT || 3001;
const VERSION: string = process.env.VERSION || "v1";
const PREFIX: string = `/${VERSION}`;

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
app.use(`${PREFIX}/search`, SearchRoutes);
app.use(`${PREFIX}/api`, APIRoutes);

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

// Get Index
app.get("/getIndex/:version/:language", async (req: Request, res: Response) => {
    try {
        // Retrieve Folder Names
        const rawFolders: Array<string> = fs.readdirSync(path.resolve(__dirname, `../html/${req.params.version}/${req.params.language}`), { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => directory.name);

        // Retrieve & Format Files
        const index: Array<IndexItem> = [];
        for (const rawFolderName of rawFolders) {
            const folderPath = path.join(__dirname, `../html/${req.params.version}/${req.params.language}/${rawFolderName}`);
            const indexItem: IndexItem = {
                "category_icon": getFolderIcon(rawFolderName.slice(2)),
                "category": rawFolderName.replace("_", " ").slice(2),
                "children": fs.readdirSync(folderPath).filter(file => file.endsWith(".html")).map(htmlFile => htmlFile.slice(2, -5))
            }
            index.push(indexItem);
        }

        // Send Result
        res.json({ "index": index });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            res.sendStatus(404);
        } else {
            logError(error);
            res.sendStatus(500);
        }
    }
});

// Get Categories
app.get("/getCategories/:version/:language", async (req: Request, res: Response) => {
    try {
        // Retrieve & Format Folder Names
        const categories: Array<FolderItem> = fs.readdirSync(path.resolve(__dirname, `../html/${req.params.version}/${req.params.language}`), { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => {
                return {
                    "category_icon": getFolderIcon(directory.name.slice(2)),
                    "category": directory.name.replace("_", " ").slice(2)
                }
            });

        // Send Result
        res.json({ "categories": categories });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            res.sendStatus(404);
        } else {
            logError(error);
            res.sendStatus(500);
        }
    }
});

// Start
app.listen(PORT, () => {
    log(`Documentation server listening on port ${PORT}`, "info");
    console.log(`Documentation server listening on port ${PORT}`);
});