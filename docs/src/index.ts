import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";

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
import { FileRequest } from "./customTypes";
app.use(`${PREFIX}/api`, APIRoutes);

// Base Route
app.get(PREFIX, (req: Request, res: Response) => {
    res.json({ "message": "Default Documentation Endpoint" });
});

// Get File
app.get(`${PREFIX}/getFile`, async (req: Request, res: Response) => {
    try {
        const searchParams = req.query as FileRequest;
        const filePath = path.join(path.resolve(__dirname, '../html'), `/${searchParams.folder}/${searchParams.name}.html`);
        const file = fs.readFileSync(filePath, "utf8");
        res.json({ "file": file });
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