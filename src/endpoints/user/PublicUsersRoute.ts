import express, { Request, Response } from "express";
import { sendError } from "../../utils/Errors";
import * as UserService from "./UserService";

const router = express.Router();

router.get("/", async (_req, res) => {
    try {
        res.status(200).json(await UserService.getPublicUsers());
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/", async (req, res) => {
    try {
        res.status(201).json(await UserService.createPublicUser(req.body));
    } catch (err) {
        sendError(res, err);
    }
});

router.get("/:userID", async (req: Request<{ userID: string }>, res: Response) => {
    try {
        res.status(200).json(await UserService.getPublicUser(req.params.userID));
    } catch (err) {
        sendError(res, err);
    }
});

router.put("/:userID", async (req: Request<{ userID: string }>, res: Response) => {
    try {
        res.status(200).json(await UserService.updatePublicUser(req.params.userID, req.body));
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/:userID", async (req: Request<{ userID: string }>, res: Response) => {
    try {
        await UserService.deleteUser(req.params.userID);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;