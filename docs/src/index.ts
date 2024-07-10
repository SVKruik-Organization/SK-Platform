import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();
app.use(express.json());

// Variables
const PORT: string | number = process.env.PORT || 3001;
const VERSION: string = process.env.VERSION || "v1";
const PREFIX: string = `/${VERSION}`;

// Other Routes
import { SearchRoutes } from "./routes/searchRoutes";
app.use(`${PREFIX}/search`, SearchRoutes);
import { APIRoutes } from "./routes/apiRoutes";
app.use(`${PREFIX}/api`, APIRoutes);

// Base Route
app.get(PREFIX, (req: Request, res: Response) => {
    res.json({ "message": "Default Documentation Endpoint Test" });
});

// Start
app.listen(PORT, () => {
    console.log(`Documentation server listening on port ${PORT}`);
});