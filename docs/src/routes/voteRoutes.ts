import express, { NextFunction, Request, Response, Router } from "express";
import { CommentRequest, VoteRequest } from "../customTypes";
import { Pool, database } from "@svkruik/sk-platform-db-conn";
const router: Router = express.Router();

// Cast Vote
router.post("/new/:version/:language", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Setup
        const voteParams = req.query as { ticket: string, value: string, type: string, category: string, page: string };
        if (!voteParams.ticket || !voteParams.value || !voteParams.category || !voteParams.page)
            throw new Error("Missing required query parameters.", { cause: { statusCode: 400 } });

        const voteRequest: VoteRequest = {
            "ticket": voteParams.ticket,
            "value": voteParams.value === "true",
            "type": voteParams.type === "null" ? null : voteParams.type,
            "category": voteParams.category === "null" ? null : voteParams.category,
            "page": voteParams.page === "null" ? null : voteParams.page
        };

        const connection: Pool = await database("bots");
        await connection.query("INSERT INTO documentation_vote (ticket, value, type, category, page) VALUES (?, ?, ?, ?, ?)", [voteRequest.ticket, voteRequest.value, voteRequest.type, voteRequest.category, voteRequest.page]);
        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }
});

// Add Comment
router.put("/comment", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Setup
        if (!req.body.ticket || !req.body.comment) throw new Error("Missing required body parameters.", { cause: { statusCode: 400 } });
        const commentRequest: CommentRequest = {
            "ticket": req.body.ticket,
            "commment": req.body.comment
        };

        const connection: Pool = await database("bots");
        await connection.query("UPDATE documentation_vote SET comment = ? WHERE ticket = ?", [commentRequest.commment, commentRequest.ticket]);
        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }
});

export { router as VoteRoutes };