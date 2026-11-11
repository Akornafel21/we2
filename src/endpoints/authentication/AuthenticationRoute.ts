import express, { Response } from "express";
import * as AuthenticationService from "./AuthenticationService";

const router = express.Router();

function sendAuthFailed(res: Response): void {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.status(401).json({Error: "Failed to create token: Authentication failed"})
}

router.get("/", async (req, res) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Basic ")) {
        return sendAuthFailed(res);
    }

    const credentials = Buffer.from(header.slice(6), "base64").toString("utf-8");
    const separator= credentials.indexOf(":");
    if (separator === -1) {
        return sendAuthFailed(res);
    }
    const userID = credentials.slice(0, separator);
    const password = credentials.slice(separator + 1);

    try {
        const token = await AuthenticationService.createToken(userID, password);
        if (!token) {
            return sendAuthFailed(res);
        }
        res.setHeader("Authorization", "Bearer " + token);
        res.status(200).json({ Success: "Token created successfully"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Failed to create token: Internal server error"})
    }
});

export default router;