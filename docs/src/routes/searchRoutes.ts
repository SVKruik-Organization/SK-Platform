import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

// Base Route
router.get("/", function (req: Request, res: Response) {
    res.json({ "message": "Default Search Endpoint" });
});

// All Pages
router.get("/all/:version", function (req: Request, res: Response) {
    const searchParams = req.query;
    console.log(searchParams);
    res.json({ "message": "Search All Endpoint" });
});

// Specific Page
router.get("/page/:version", function (req: Request, res: Response) {
    const searchParams = req.query;
    console.log(searchParams);
    res.json({ "message": "Search Page Endpoint" });
});

export { router as SearchRoutes };