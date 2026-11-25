import express, { Request, Response, Router } from "express";
import { isAuthenticated, isAdministrator } from "../../utils/AuthenticationUtils";
import { sendError } from "../../utils/Errors";
import * as DegreeCourseService from "./DegreeCourseService";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json(await DegreeCourseService.getDegreeCourses(req.query));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        res.status(200).json(await DegreeCourseService.getDegreeCourse(req.params.id));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.post("/", isAuthenticated, isAdministrator, async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json(await DegreeCourseService.createDegreeCourse(req.body));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.put(
    "/:id",
    isAuthenticated,
    isAdministrator,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            res.status(200).json(await DegreeCourseService.updateDegreeCourse(req.params.id, req.body));
        } catch (err: unknown) {
            sendError(res, err);
        }
    }
);

router.delete(
    "/:id",
    isAuthenticated,
    isAdministrator,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            await DegreeCourseService.deleteDegreeCourse(req.params.id);
            res.status(204).send();
        } catch (err: unknown) {
            sendError(res, err);
        }
    }
);

export default router;