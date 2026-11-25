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





// відкритий ендпоінт, поля з JSON
// 1 BODY (JSON):     усе з тіла, токена немає | interface{unknown} → 
// (req.body ?? {}) as X → typeof → createToken → setHeader("Authorization","Bearer "+t) + 200 / 401

// import express, { Request, Response, Router } from "express";
// import * as AuthenticationService from "../authentication/AuthenticationService";

// const router: Router = express.Router();

// // Form des erwarteten Bodys. "unknown", weil der Client alles Mögliche schicken kann.
// interface LoginBody {
//     userID?: unknown;
//     password?: unknown;
// }

// function sendAuthFailed(res: Response): void {
//     res.status(401).json({ Error: "Failed to create token: Authentication failed" });
// }

// // POST /api/abnahme/loginBody
// router.post("/loginBody", async (req: Request, res: Response): Promise<void> => {
//     // Express 5: ohne JSON-Body ist req.body undefined -> mit ?? {} absichern
//     const body: LoginBody = (req.body ?? {}) as LoginBody;
//     const userID: unknown = body.userID;
//     const password: unknown = body.password;

//     // Nur echte Strings durchlassen (schützt vor {"$ne": null} und vor bcrypt-Fehlern)
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


// httpServer.ts
// import abnahmeRoute from "./endpoints/abnahme/AbnahmeRoute";
// app.use("/api/abnahme", abnahmeRoute);        // ДО 404-handler