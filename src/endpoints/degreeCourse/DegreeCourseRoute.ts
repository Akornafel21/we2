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










// import express, { Request, Response, Router } from "express";
// import mongoose, { HydratedDocument } from "mongoose";
// import { isAuthenticated } from "../../utils/AuthenticationUtils";
// import { TokenPayload } from "../authentication/AuthenticationService";
// import { sendError, ValidationError, NotFoundError } from "../../utils/Errors";
// import { DegreeCourse, IDegreeCourse } from "../degreeCourse/DegreeCourseModel";

// const router: Router = express.Router();

// interface CourseDetailsBody {
//     id?: unknown;
// }

// interface CourseDetailsResponse {
//     requestedBy: string;
//     course: {
//         id: string;
//         name: string;
//         shortName: string;
//         universityName: string;
//         universityShortName: string;
//     };
//     otherCoursesAtUniversity: number;
// }

// // POST /api/abnahme/courseDetails
// router.post("/courseDetails", isAuthenticated, async (req: Request, res: Response): Promise<void> => {
//     // Wer fragt? Kommt aus dem Token.
//     const requester: TokenPayload = res.locals.user as TokenPayload;

//     // Was wird gefragt? Kommt aus dem Body.
//     const body: CourseDetailsBody = (req.body ?? {}) as CourseDetailsBody;
//     const id: unknown = body.id;

//     try {
//         if (typeof id !== "string" || id.trim() === "") {
//             throw new ValidationError("id is required");
//         }
//         // Ohne diese Prüfung wirft findById bei Unsinn einen CastError -> 500 statt 400.
//         if (!mongoose.isValidObjectId(id)) {
//             throw new ValidationError(`Invalid id: ${id}`);
//         }

//         const course: HydratedDocument<IDegreeCourse> | null = await DegreeCourse.findById(id);
//         if (!course) {
//             throw new NotFoundError(`No degree course found with id ${id}`);
//         }

//         // Zweite Abfrage: wie viele weitere Studiengänge hat dieselbe Hochschule?
//         const otherCount: number = await DegreeCourse.countDocuments({
//             universityShortName: course.universityShortName,
//             _id: { $ne: course._id },
//         });

//         const result: CourseDetailsResponse = {
//             requestedBy: requester.userID,
//             course: {
//                 id: course._id.toString(),
//                 name: course.name,
//                 shortName: course.shortName,
//                 universityName: course.universityName,
//                 universityShortName: course.universityShortName,
//             },
//             otherCoursesAtUniversity: otherCount,
//         };

//         res.status(200).json(result);
//     } catch (err: unknown) {
//         sendError(res, err);
//     }
// });

// export default router;