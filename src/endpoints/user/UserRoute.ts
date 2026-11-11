import express, { Request, Response } from "express";
import { isAuthenticated, isAdministrator } from "../../utils/AuthenticationUtils";
import { sendError } from "../../utils/Errors";
import { TokenPayload } from "../authentication/AuthenticationService";
import * as UserService from "./UserService";

const router = express.Router();

router.get("/", isAuthenticated, isAdministrator, async (_req, res) => {
    try {
        res.status(200).json(await UserService.getUsers());
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/", isAuthenticated, isAdministrator, async (req, res) => {
    try {
        res.status(201).json(await UserService.createUser(req.body));
    } catch (err) {
        sendError(res, err);
    }
});

router.get("/:userID", isAuthenticated, async (req: Request<{ userID: string }>, res: Response) => {
    const requester = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await UserService.getUser(req.params.userID, requester));
    } catch (err) {
        sendError(res, err);
    }
});

router.put("/:userID", isAuthenticated, async (req: Request<{ userID: string }>, res: Response) => {
    const requester = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await UserService.updateUser(req.params.userID, req.body, requester));
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/:userID", isAuthenticated, isAdministrator, async (req: Request<{ userID: string }>, res: Response) => {
    try {
        await UserService.deleteUser(req.params.userID);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;