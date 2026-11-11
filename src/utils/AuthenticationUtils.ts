import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../endpoints/authentication/AuthenticationService";

function sendNotAuthorized(res: Response): void {
    res.status(401).json({ Error: "Not Authorized" });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return sendNotAuthorized(res);
    }
    const payload = verifyToken(header.slice(7));
    if (!payload) {
        return sendNotAuthorized(res);
    }
    res.locals.user = payload;
    next();
}

export function isAdministrator(_req: Request, res: Response, next: NextFunction): void {
    const user = res.locals.user as TokenPayload | undefined;
    if (!user?.isAdministrator) {
        return sendNotAuthorized(res);
    }
    next();
}