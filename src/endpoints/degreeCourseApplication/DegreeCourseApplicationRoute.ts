import express, { Request, Response, Router } from "express";
import { isAuthenticated, isAdministrator } from "../../utils/AuthenticationUtils";
import { sendError } from "../../utils/Errors";
import { TokenPayload } from "../authentication/AuthenticationService";
import * as ApplicationService from "./DegreeCourseApplicationService";

const router: Router = express.Router();

router.get("/", isAuthenticated, isAdministrator, async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json(await ApplicationService.getApplications(req.query));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

// Muss VOR "/:id" stehen, sonst würde Express "myApplications" als id interpretieren
router.get("/myApplications", isAuthenticated, async (_req: Request, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await ApplicationService.getMyApplications(requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.get("/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await ApplicationService.getApplication(req.params.id, requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.post("/", isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(201).json(await ApplicationService.createApplication(req.body, requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.put("/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await ApplicationService.updateApplication(req.params.id, req.body, requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.delete("/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        await ApplicationService.deleteApplication(req.params.id, requester);
        res.status(204).send();
    } catch (err: unknown) {
        sendError(res, err);
    }
});

export default router;