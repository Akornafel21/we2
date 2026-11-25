import express, { Request, Response, Router } from "express";
import { sendError } from "../../utils/Errors";
import * as UserService from "./UserService";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json(await UserService.getPublicUsers());
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json(await UserService.createPublicUser(req.body));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.get("/:userID", async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    try {
        res.status(200).json(await UserService.getPublicUser(req.params.userID));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.put("/:userID", async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    try {
        res.status(200).json(await UserService.updatePublicUser(req.params.userID, req.body));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.delete("/:userID", async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    try {
        await UserService.deleteUser(req.params.userID);
        res.status(204).send();
    } catch (err: unknown) {
        sendError(res, err);
    }
});

export default router;