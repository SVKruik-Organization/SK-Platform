import express, { NextFunction, Request, Response, Router } from "express";
import { CommentRequest, VoteRequest } from "../customTypes";
import { z } from "zod";
import { Pool, database } from "@svkruik/sk-platform-db-conn";
const router: Router = express.Router();

// Cast Vote
router.post("/new/:version/:language", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Setup
        const bodySchema = z.object({
            ticket: z.string(),
            value: z.string().transform((val) => val === "true"),
            type: z.enum(["Doc", "Guide"]).optional().nullable(), // Null for landing page
            category: z.string().optional().nullable(),
            page: z.string().optional().nullable(), // Null for category vote
        });
        const parseResult = bodySchema.safeParse(req.body);
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { ticket, value, type, category, page } = parseResult.data as VoteRequest;

        const connection: Pool = await database("bots");
        await connection.query("INSERT INTO documentation_vote (ticket, value, type, category, page) VALUES (?, ?, ?, ?, ?);", [ticket, value, type, category, page]);
        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }
});

// Add Comment
router.put("/comment", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Setup
        const bodySchema = z.object({
            ticket: z.string(),
            comment: z.string(),
        });
        const parseResult = bodySchema.safeParse(req.body);
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { ticket, comment } = parseResult.data as CommentRequest;

        const connection: Pool = await database("bots");
        await connection.query("UPDATE documentation_vote SET comment = ? WHERE ticket = ?;", [comment, ticket]);
        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }
});

export { router as VoteRoutes };