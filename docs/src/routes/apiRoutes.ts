import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

// Base Route
router.get("/", function (req: Request, res: Response) {
    res.json({ "message": "Default API Endpoint" });
});

// Status Shield
router.get("/status/badge", (req, res) => {
    res.json({ "schemaVersion": 1, "label": "Docs Status", "message": "online", "color": "brightgreen" });
});

export { router as APIRoutes };