import { NextFunction, Request, Response } from "express";

export function deploymentAuthentication(req: Request, res: Response, next: NextFunction): Response | void {
    const password: string | undefined = req.headers.authorization;
    if (!password || password.split(" ")[1] !== process.env.DEPLOYMENT_KEY) return res.sendStatus(401);
    next();
}