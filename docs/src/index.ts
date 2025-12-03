import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { DocumentationFile, FileRequest, IndexItem, RecommendedItem, UplinkMessage, UrlParams } from "./customTypes";
import { getFile, getIndex, getRecommendedItems } from "./utils/file";
import { SearchRoutes } from "./routes/searchRoutes";
import { apiMiddleware, log } from "./utils/logger";
import { rateLimit } from 'express-rate-limit';
import { Channel, Message } from "amqplib";
import shell from "shelljs";
import { getUplinkConnection } from "./utils/networking";
import { VoteRoutes } from "./routes/voteRoutes";
dotenv.config();

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
app.use(apiMiddleware);
app.use("/search", SearchRoutes);
app.use("/votes", VoteRoutes);
app.enable("trust proxy");
app.set('trust proxy', 1);
app.use(helmet());

// Base Route
app.get("/", (_req: Request, res: Response) => {
    res.redirect(308, "https://platform.stefankruik.com/documentation");
});

// Status Shield
app.get("/api/status/badge", (_req: Request, res: Response) => {
    res.json({ "schemaVersion": 1, "label": "Docs Status", "message": "online", "color": "brightgreen" });
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
app.get("/refresh/:version/:language", refreshLimit, async (req: Request, res: Response) => {
    const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language);
    if (!params) return res.sendStatus(400);

    // Indices
    const docIndex: Array<IndexItem> | number = getIndex(params.version, params.language, "Doc");
    if (typeof docIndex === "number") return res.sendStatus(docIndex);
    const guideIndex: Array<IndexItem> | number = getIndex(params.version, params.language, "Guide");
    if (typeof guideIndex === "number") return res.sendStatus(guideIndex);

    // Recommended Items
    const recommendedDocItems: Array<RecommendedItem> | number = getRecommendedItems(params.language, "Doc");
    if (typeof recommendedDocItems === "number") return res.sendStatus(recommendedDocItems);
    const recommendedGuideItems: Array<RecommendedItem> | number = getRecommendedItems(params.language, "Guide");
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
    const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language, req.params.type);
    if (!params) return res.sendStatus(400);

    const file: DocumentationFile | number = await getFile(searchQuery.folder, searchQuery.name, params.version, params.language, params.type, false);
    if (typeof parent === "number") return res.sendStatus(parent);
    return res.json({ "file": file });
});

// Get Index
app.get("/getIndex/:version/:language/:type", async (req: Request, res: Response) => {
    const params: UrlParams | false = validateUrlParams(req.params.version, req.params.language, req.params.type);
    if (!params) return res.sendStatus(400);

    const index: Array<IndexItem> | number = getIndex(params.version, params.language, params.type);
    if (typeof index === "number") return res.sendStatus(index);
    return res.json({ "index": index });
});

// Get Recommended Items
app.get("/getRecommendedItems/:language/:type", async (req: Request, res: Response) => {
    const params: UrlParams | false = validateUrlParams(undefined, req.params.language, req.params.type);
    if (!params) return res.sendStatus(400);

    const data: Array<RecommendedItem> | number = getRecommendedItems(params.language, params.type);
    if (typeof data === "number") return res.sendStatus(data);
    return res.json({ "recommendedItems": data });
});

// Start
const PORT: number = parseInt(process.env.PORT as string) || 3002;
app.listen(PORT, "0.0.0.0", async () => {
    // Uplink Connection
    try {
        const channel: Channel | null = await getUplinkConnection();
        if (!channel) throw new Error("Uplink connection missing. Starting server without Uplink connection.");
        channel.assertExchange("unicast-products", "direct", { durable: false });
        const queue = await channel.assertQueue("", { exclusive: true });
        await channel.bindQueue(queue.queue, "unicast-products", "Docs");

        // Listen
        log(`Uplink consumer listening on exchange 'unicast-products' binded to 'Docs'.`, "info");
        channel.consume(queue.queue, (message: Message | null) => {
            if (message) {
                const messageContent: UplinkMessage = JSON.parse(message.content.toString());
                if (messageContent.task === "Deploy" && process.platform === "linux") {
                    log(`Received new deploy task from ${messageContent.sender}. Running Documentation deployment script.`, "info");
                    channel.ack(message);
                    shell.exec("bash deploy.sh");
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