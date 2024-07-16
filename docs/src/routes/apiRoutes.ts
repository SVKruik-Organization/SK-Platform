import express, { Request, Response, Router } from "express";
import { deploymentAuthentication } from "../utils/middleware";
import * as shell from "shelljs";
const router: Router = express.Router();

// Base Route
router.get("/", function (req: Request, res: Response) {
    res.json({ "message": "Default API Endpoint" });
});

// Status Shield
router.get("/status/badge", (req: Request, res: Response) => {
    res.json({ "schemaVersion": 1, "label": "Docs Status", "message": "online", "color": "brightgreen" });
});

// Documentation Deployment
router.post("/deploy", deploymentAuthentication, (req: Request, res: Response) => {
    res.json({ "message": "Received" });
    shell.exec("sh deploy.sh");
});

export { router as APIRoutes };