import express, { Request, Response, Router } from "express";
import * as AuthenticationService from "./AuthenticationService";

const router: Router = express.Router();

function sendAuthFailed(res: Response): void {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.status(401).json({ Error: "Failed to create token: Authentication failed" });
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const header: string | undefined = req.headers.authorization;
    if (!header?.startsWith("Basic ")) {
        return sendAuthFailed(res);
    }

    const credentials: string = Buffer.from(header.slice(6), "base64").toString("utf-8");
    const separator: number = credentials.indexOf(":");
    if (separator === -1) {
        return sendAuthFailed(res);
    }
    const userID: string = credentials.slice(0, separator);
    const password: string = credentials.slice(separator + 1);

    try {
        const token: string | null = await AuthenticationService.createToken(userID, password);
        if (!token) {
            return sendAuthFailed(res);
        }
        res.setHeader("Authorization", "Bearer " + token);
        res.status(200).json({ Success: "Token created successfully" });
    } catch (err: unknown) {
        console.error(err);
        res.status(500).json({ Error: "Failed to create token: Internal server error" });
    }
});

export default router;