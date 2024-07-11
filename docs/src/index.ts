import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import { FileRequest, IndexItem } from "./customTypes";
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

// Other Routes
import { SearchRoutes } from "./routes/searchRoutes";
app.use(`${PREFIX}/search`, SearchRoutes);
import { APIRoutes } from "./routes/apiRoutes";
app.use(`${PREFIX}/api`, APIRoutes);

// Base Route
app.get("/", (req: Request, res: Response) => {
    res.json({ "message": "Default Documentation Endpoint" });
});

// Get File
app.get("/getFile/:version/:language", async (req: Request, res: Response) => {
    try {
        // Process Search

        // TODO: Add metadata (GitHub/Git API?)

        const searchParams = req.query as FileRequest;
        const filePath = path.join(path.resolve(__dirname, '../html'), `${req.params.version}/${req.params.language}/${searchParams.folder}/${searchParams.name}.html`);

        // Retrieve & Send File
        const file = fs.readFileSync(filePath, "utf8");
        res.json({ "file": file });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            res.sendStatus(404);
        } else res.sendStatus(500);
    }
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
                "category": rawFolderName.split("_").join(" "),
                "children": fs.readdirSync(folderPath).filter(file => file.endsWith(".html")).map(htmlFile => htmlFile.slice(0, -5))
            }
            index.push(indexItem);
        }

        // Send Result
        res.json({ "index": index });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            res.sendStatus(404);
        } else res.sendStatus(500);
    }
});

// Get Categories
app.get("/getCategories/:version/:language", async (req: Request, res: Response) => {
    try {
        // Retrieve & Format Folder Names
        const categories: Array<string> = fs.readdirSync(path.resolve(__dirname, `../html/${req.params.version}/${req.params.language}`), { withFileTypes: true })
            .filter(entity => entity.isDirectory())
            .map(directory => directory.name.split("_").join(" "));

        // Send Result
        res.json({ "categories": categories });
    } catch (error: any) {
        if (error.code === "ENOENT") {
            res.sendStatus(404);
        } else res.sendStatus(500);
    }
});

// Start
app.listen(PORT, () => {
    console.log(`Documentation server listening on port ${PORT}`);
});