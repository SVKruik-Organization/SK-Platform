import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DocumentationFile, DocumentationFileMetadata, FileRequest, FilesRequest, FolderItem, IndexItem, RecommendedItem, UplinkMessage } from "./customTypes";
import { getCategories, getDefaultFile, getFile, getFiles, getIndex, getRecommendedItems } from "./utils/file";
import { SearchRoutes } from "./routes/searchRoutes";
import { apiMiddleware, log } from "./utils/logger";
import { rateLimit } from 'express-rate-limit';
import { Channel, Message } from "amqplib";
import shell from "shelljs";
import { getConnection } from "./utils/connection";
import mariadb, { Pool } from 'mariadb';
import { VoteRoutes } from "./routes/voteRoutes";
dotenv.config();
const app: Express = express();
app.use(express.json());

// CORS Config
if (!process.env.CORS) throw new Error("Missing CORS configuration.");
const corsOptions = {
    origin: process.env.CORS.split(","),
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(apiMiddleware);


// Database Connection
if (!process.env.DB_HOST || !process.env.DB_PORT) throw new Error("Missing database credentials.");
const database: Pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});
export { database };
app.use("/search", SearchRoutes);
app.use("/votes", VoteRoutes);

// Base Route
app.get("/", (_req: Request, res: Response) => {
    res.redirect(308, "https://platform.stefankruik.com/documentation");
});

// Status Shield
app.get("/api/status/badge", (_req: Request, res: Response) => {
    res.json({ "schemaVersion": 1, "label": "Docs Status", "message": "online", "color": "brightgreen" });
});

// Refresh
const refreshLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
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
    const recommendedGuideItems: Array<RecommendedItem> | number = getRecommendedItems(req.params.language, "Guide");
    if (typeof recommendedGuideItems === "number") return res.sendStatus(recommendedGuideItems);

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
    const metadata: Array<DocumentationFileMetadata> = await database.query("SELECT * FROM documentation_page WHERE category = ? AND name = ? UNION ALL SELECT dp.* FROM documentation_page dp JOIN ( SELECT related FROM documentation_page WHERE category = ? AND name = ? ) AS target_related ON FIND_IN_SET(dp.id, target_related.related) > 0;", [searchQuery.folder, searchQuery.name, searchQuery.folder, searchQuery.name]);
    const file: DocumentationFile | number = getFile(searchQuery.folder, searchQuery.name, req.params.version, req.params.language, req.params.type);
    if (typeof file === "number") return res.sendStatus(file);
    return res.json({ "file": file, "meta": metadata ? metadata[0] : null, "related": metadata ? metadata.slice(1) : null });
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
    return res.json({ "recommended_items": data });
});

// Get Categories
app.get("/getCategories/:version/:language/:type", async (req: Request, res: Response) => {
    const categories: Array<FolderItem> | number = getCategories(req.params.version, req.params.language, req.params.type);
    if (typeof categories === "number") return res.sendStatus(categories);
    return res.json({ "categories": categories });
});

// Start
const PORT: number = parseInt(process.env.PORT as string) || 3002;
app.listen(PORT, "0.0.0.0", async () => {
    // Uplink Connection
    try {
        const channel: Channel | null = await getConnection();
        if (!channel) throw new Error("Uplink connection missing. Starting server without Uplink connection.");
        channel.assertExchange("unicast-products", "direct", { durable: false });
        const queue = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(queue.queue, "unicast-products", "platform");

        // Listen
        log(`Uplink consumer listening on exchange 'unicast-products' binded to 'platform'.`, "info");
        channel.consume(queue.queue, (message: Message | null) => {
            if (message) {
                const messageContent: UplinkMessage = JSON.parse(message.content.toString());
                if (messageContent.task === "Deploy" && process.platform === "linux") {
                    log(`Received new deploy task from ${messageContent.sender}. Running Documentation deployment script.`, "info");
                    shell.exec("bash deploy.sh");
                    channel.ack(message);
                }
            }
        }, {
            noAck: false
        });
    } catch (error: any) {
        log(`Error connecting to Uplink: ${error.message}`, "error");
    }
    log(`Documentation server listening on port ${PORT}`, "info");
});