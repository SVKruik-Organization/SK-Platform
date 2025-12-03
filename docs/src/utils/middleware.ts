import { logData } from "@svkruik/sk-platform-formatters";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to authenticate deployment requests.
 * 
 * @param req The request.
 * @param res The response.
 * @param next Downstream middleware.
 */
export function deploymentAuthentication(req: Request, res: Response, next: NextFunction): Response | void {
    const password: string | undefined = req.headers.authorization;
    if (!password || password.split(" ")[1] !== process.env.DEPLOYMENT_KEY) return res.sendStatus(401);
    return next();
}

/**
 * Middleware to log API requests.
 * @param req The request.
 * @param res The response.
 * @param next Downstream middleware.
 */
export function apiRequest(req: Request, _res: Response, next: NextFunction): void {
    logData(`API Request || Agent: ${req.headers["user-agent"]} || ${req.method} ${req.url} || Body: ${req.body ? `(100 char limit) ${JSON.stringify(req.body).slice(0, 100)}` : "None"}`, "info");
    return next();
}