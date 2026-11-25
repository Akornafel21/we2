import express, { Request, Response, Router } from "express";
import { isAuthenticated, isAdministrator } from "../../utils/AuthenticationUtils";
import { sendError } from "../../utils/Errors";
import { TokenPayload } from "../authentication/AuthenticationService";
import * as UserService from "./UserService";

const router: Router = express.Router();

router.get("/", isAuthenticated, isAdministrator, async (_req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json(await UserService.getUsers());
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.post("/", isAuthenticated, isAdministrator, async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json(await UserService.createUser(req.body));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.get("/:userID", isAuthenticated, async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await UserService.getUser(req.params.userID, requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.put("/:userID", isAuthenticated, async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
    const requester: TokenPayload = res.locals.user as TokenPayload;
    try {
        res.status(200).json(await UserService.updateUser(req.params.userID, req.body, requester));
    } catch (err: unknown) {
        sendError(res, err);
    }
});

router.delete(
    "/:userID",
    isAuthenticated,
    isAdministrator,
    async (req: Request<{ userID: string }>, res: Response): Promise<void> => {
        try {
            await UserService.deleteUser(req.params.userID);
            res.status(204).send();
        } catch (err: unknown) {
            sendError(res, err);
        }
    }
);

export default router;






// 3 BODY (форма):    усе з тіла, але не JSON | обробник як у 1, 
// різниця лише app.use(express.urlencoded({extended:false})) у httpServer; повторений ключ = масив

// import express, { Request, Response, Router } from "express";
// import * as AuthenticationService from "../authentication/AuthenticationService";

// const router: Router = express.Router();

// // Form der erwarteten Daten. "unknown", weil auch Formulardaten Arrays liefern können.
// interface LoginFormBody {
//     userID?: unknown;
//     password?: unknown;
// }

// function sendAuthFailed(res: Response): void {
//     res.status(401).json({ Error: "Failed to create token: Authentication failed" });
// }

// // POST /api/abnahme/loginForm  (Content-Type: application/x-www-form-urlencoded)
// router.post("/loginForm", async (req: Request, res: Response): Promise<void> => {
//     // Ohne express.urlencoded() in httpServer.ts ist req.body hier undefined.
//     const body: LoginFormBody = (req.body ?? {}) as LoginFormBody;
//     const userID: unknown = body.userID;
//     const password: unknown = body.password;

//     // Auch hier nötig: userID=a&userID=b liefert ein Array, keinen String.
//     if (typeof userID !== "string" || typeof password !== "string") {
//         return sendAuthFailed(res);
//     }

//     try {
//         const token: string | null = await AuthenticationService.createToken(userID, password);
//         if (!token) {
//             return sendAuthFailed(res);
//         }
//         res.setHeader("Authorization", "Bearer " + token);
//         res.status(200).json({ Success: "Token created successfully" });
//     } catch (err: unknown) {
//         console.error(err);
//         res.status(500).json({ Error: "Failed to create token: Internal server error" });
//     }
// });

// export default router;