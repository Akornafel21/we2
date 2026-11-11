import express, { Request, Response } from "express";
import { isAuthenticated, isAdministrator } from "../../utils/AuthenticationUtils";
import { sendError } from "../../utils/Errors";
import * as DegreeCourseService from "./DegreeCourseService";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.status(200).json(await DegreeCourseService.getDegreeCourses(req.query));
    } catch (err) {
        sendError(res, err);
    }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        res.status(200).json(await DegreeCourseService.getDegreeCourse(req.params.id));
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/", isAuthenticated, isAdministrator, async (req, res) => {
    try {
        res.status(201).json(await DegreeCourseService.createDegreeCourse(req.body));
    } catch (err) {
        sendError(res, err);
    }
});

router.put("/:id", isAuthenticated, isAdministrator, async (req: Request<{ id: string }>, res: Response) => {
    try {
        res.status(200).json(await DegreeCourseService.updateDegreeCourse(req.params.id, req.body));
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/:id", isAuthenticated, isAdministrator, async (req: Request<{ id: string }>, res: Response) => {
    try {
        await DegreeCourseService.deleteDegreeCourse(req.params.id);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;