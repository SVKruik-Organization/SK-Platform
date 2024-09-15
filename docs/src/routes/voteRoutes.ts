import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import { CommentRequest, VoteRequest } from "../customTypes";
import { database } from "..";
import { logError } from "../utils/logger";
dotenv.config();
const router: Router = express.Router();

// Cast Vote
router.post("/new/:version/:language", async (req: Request, res: Response) => {
    try {
        // Setup
        const voteParams = req.query as { ticket: string, value: string, type: string, category: string, page: string };
        if (!voteParams.ticket || !voteParams.value || !voteParams.category || !voteParams.page) return res.sendStatus(400);
        const voteRequest: VoteRequest = {
            "ticket": voteParams.ticket,
            "value": voteParams.value === "true",
            "type": voteParams.type === "null" ? null : voteParams.type,
            "category": voteParams.category === "null" ? null : voteParams.category,
            "page": voteParams.page === "null" ? null : voteParams.page
        };

        await database.query("INSERT INTO documentation_vote (ticket, value, type, category, page) VALUES (?, ?, ?, ?, ?)", [voteRequest.ticket, voteRequest.value, voteRequest.type, voteRequest.category, voteRequest.page]);
        return res.sendStatus(200);
    } catch (error: any) {
        logError(error);
        return res.sendStatus(500);
    }
});

// Add Comment
router.put("/comment", async (req: Request, res: Response) => {
    try {
        // Setup
        const commentParams = req.query as { ticket: string };
        if (!commentParams.ticket || !req.body.comment) return res.sendStatus(400);
        const commentRequest: CommentRequest = {
            "ticket": commentParams.ticket,
            "commment": req.body.comment
        };

        await database.query("UPDATE documentation_vote SET comment = ? WHERE ticket = ?", [commentRequest.commment, commentRequest.ticket]);
        console.log(commentRequest);
        return res.sendStatus(200);
    } catch (error: any) {
        logError(error);
        return res.sendStatus(500);
    }
});

export { router as VoteRoutes };